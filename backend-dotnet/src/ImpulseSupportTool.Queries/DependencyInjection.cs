using ImpulseSupportTool.Queries.Analytics;
using ImpulseSupportTool.Queries.Orders.GetOrderDetails;
using ImpulseSupportTool.Util;
using Microsoft.Extensions.DependencyInjection;

namespace ImpulseSupportTool.Queries;

public static class DependencyInjection
{
    /// <summary>
    /// Registers every query handler in this assembly and the analytics log location.
    /// </summary>
    public static IServiceCollection AddQueries(this IServiceCollection services)
    {
        services.AddSingleton<AnalyticsLogLocation>();
        return services.AddRequestHandlers(typeof(GetOrderDetailsQueryHandler).Assembly);
    }
}
