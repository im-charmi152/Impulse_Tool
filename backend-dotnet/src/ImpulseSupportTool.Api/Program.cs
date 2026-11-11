using ImpulseSupportTool.Commands;
using ImpulseSupportTool.Data;
using ImpulseSupportTool.Data.Abstractions;
using ImpulseSupportTool.Queries;
using ImpulseSupportTool.Util;
using ImpulseSupportTool.Util.Messaging;

var builder = WebApplication.CreateBuilder(args);

// Connection strings live in their own file (no passwords; passwords are user secrets).
builder.Configuration.AddJsonFile("appsettings.Connections.json", optional: false, reloadOnChange: true);

// --------------------------------------------------
// Controllers and model-binding error logging
// --------------------------------------------------
builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var errors = context.ModelState
                .Where(e => e.Value?.Errors.Count > 0)
                .Select(e => new
                {
                    e.Key,
                    Errors = e.Value!.Errors.Select(x => x.ErrorMessage)
                });

            Console.WriteLine(
                ">>> MODEL BINDING ERROR: " +
                System.Text.Json.JsonSerializer.Serialize(errors));

            return new Microsoft.AspNetCore.Mvc.BadRequestObjectResult(errors);
        };
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --------------------------------------------------
// Clean Architecture composition root
//   Util     -> CQRS dispatcher
//   Commands -> write-side handlers
//   Queries  -> read-side handlers
//   Data     -> Oracle order repository, SQLite logs, analytics writer, admin vault
// --------------------------------------------------
builder.Services.AddMessaging();
builder.Services.AddCommands();
builder.Services.AddQueries();
builder.Services.AddData(builder.Configuration, builder.Environment);

// --------------------------------------------------
// Existing CORS policy
// --------------------------------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// --------------------------------------------------
// Verify dependency injection for the main services
// --------------------------------------------------
try
{
    using var scope = app.Services.CreateScope();

    var dispatcher = scope.ServiceProvider.GetRequiredService<IDispatcher>();
    Console.WriteLine($">>> IDispatcher resolved OK: {dispatcher.GetType().Name}");

    var repository = scope.ServiceProvider.GetRequiredService<IOrderRepository>();
    Console.WriteLine($">>> IOrderRepository resolved OK: {repository.GetType().Name}");
}
catch (Exception ex)
{
    Console.WriteLine($">>> DI FAILED: {ex}");
}

// --------------------------------------------------
// Middleware
// --------------------------------------------------
app.UseCors("FrontendPolicy");

app.Use(async (context, next) =>
{
    Console.WriteLine(
        $">>> REQUEST IN: {context.Request.Method} {context.Request.Path}");

    await next();

    Console.WriteLine(
        $">>> RESPONSE OUT: {context.Response.StatusCode}");
});

app.UseSwagger();
app.UseSwaggerUI();

// Keep authorization middleware commented out as before.
app.MapControllers();

// --------------------------------------------------
// Existing debug endpoint
// --------------------------------------------------
app.MapGet("/debug/routes", (IEnumerable<EndpointDataSource> sources) =>
    string.Join(
        "\n",
        sources.SelectMany(s => s.Endpoints)
            .Select(e => e.DisplayName))
);

app.Run();
