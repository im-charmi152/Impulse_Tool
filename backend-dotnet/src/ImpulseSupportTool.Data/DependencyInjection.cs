using ImpulseSupportTool.Data.Abstractions;
using ImpulseSupportTool.Data.Analytics;
using ImpulseSupportTool.Data.Oracle;
using ImpulseSupportTool.Data.Security;
using ImpulseSupportTool.Data.Sqlite;
using ImpulseSupportTool.Models.Options;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace ImpulseSupportTool.Data;

public static class DependencyInjection
{
    /// <summary>
    /// Registers every store and repository: the Oracle order repository, SQLite access logs,
    /// the analytics queue and its background writer, and the admin vault.
    /// </summary>
    public static IServiceCollection AddData(
        this IServiceCollection services,
        IConfiguration configuration,
        IWebHostEnvironment environment)
    {
        // Order data (Oracle ODS, read only)
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<EnvironmentMapper>();

        // RADIUS analytics
        services.Configure<AnalyticsOptions>(configuration.GetSection("Analytics"));
        services.PostConfigure<AnalyticsOptions>(options =>
        {
            options.LogDirectory = ResolveAnalyticsDirectory(environment.ContentRootPath, options.LogDirectory);
        });
        services.AddSingleton(sp => sp.GetRequiredService<IOptions<AnalyticsOptions>>().Value);
        services.AddSingleton<IAnalyticsEventQueue, ChannelAnalyticsEventQueue>();
        services.AddHostedService<AnalyticsLogWriter>();

        // RADIUS access logs and admin vault
        services.Configure<AccessLogOptions>(configuration.GetSection("AccessLog"));
        services.AddSingleton<IUserAccessStore>(sp =>
        {
            var options = sp.GetRequiredService<IOptions<AccessLogOptions>>().Value;
            return new UserAccessLog(ResolveAccessPath(environment, options.UsersDatabase, Path.Combine("logs", "radius-users.db")));
        });
        services.AddSingleton<IApprovalStore>(sp =>
        {
            var options = sp.GetRequiredService<IOptions<AccessLogOptions>>().Value;
            return new ApprovalLog(ResolveAccessPath(environment, options.RequestsDatabase, Path.Combine("logs", "radius-requests.db")));
        });
        services.AddSingleton<IGuestStore>(sp =>
        {
            var options = sp.GetRequiredService<IOptions<AccessLogOptions>>().Value;
            return new GuestLog(ResolveAccessPath(environment, options.GuestsDatabase, Path.Combine("logs", "radius-guests.db")));
        });
        services.AddSingleton<IAdminAuthenticator, AdminCredentialStore>();

        return services;
    }

    private static string ResolveAnalyticsDirectory(string contentRoot, string? configured)
    {
        var path = string.IsNullOrWhiteSpace(configured)
            ? Path.Combine("logs", "analytics")
            : configured.Trim();
        var windowsPath = path.Contains(':') || path.Contains('\\');
        if (windowsPath && !OperatingSystem.IsWindows())
        {
            return Path.Combine(contentRoot, "logs", "analytics");
        }

        return Path.IsPathRooted(path) ? path : Path.Combine(contentRoot, path);
    }

    private static string ResolveAccessPath(IWebHostEnvironment environment, string? configured, string fallback)
    {
        var relative = string.IsNullOrWhiteSpace(configured) ? fallback : configured;
        return Path.IsPathRooted(relative)
            ? relative
            : Path.Combine(environment.ContentRootPath, relative);
    }
}
