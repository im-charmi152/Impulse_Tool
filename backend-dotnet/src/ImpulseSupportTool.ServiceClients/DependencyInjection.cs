using ImpulseSupportTool.ServiceClients.Abstractions;
using ImpulseSupportTool.ServiceClients.Oracle;
using Microsoft.Extensions.DependencyInjection;

namespace ImpulseSupportTool.ServiceClients;

public static class DependencyInjection
{
    /// <summary>
    /// Registers the clients for the external order systems.
    /// </summary>
    public static IServiceCollection AddServiceClients(this IServiceCollection services)
    {
        services.AddScoped<IOrderServiceClient, OrderServiceClient>();
        services.AddScoped<EnvironmentMapper>();
        return services;
    }
}
