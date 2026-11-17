using System.Reflection;
using ImpulseSupportTool.Util.Messaging;
using Microsoft.Extensions.DependencyInjection;

namespace ImpulseSupportTool.Util;

public static class DependencyInjection
{
    /// <summary>
    /// Registers the CQRS dispatcher.
    /// </summary>
    public static IServiceCollection AddMessaging(this IServiceCollection services)
    {
        services.AddScoped<IDispatcher, Dispatcher>();
        return services;
    }

    /// <summary>
    /// Finds every <see cref="IRequestHandler{TRequest,TResponse}"/> implementation in the
    /// assembly and registers it, so a new handler needs no manual registration.
    /// </summary>
    public static IServiceCollection AddRequestHandlers(this IServiceCollection services, Assembly assembly)
    {
        foreach (var type in assembly.GetTypes())
        {
            if (type.IsAbstract || type.IsInterface || type.IsGenericTypeDefinition)
            {
                continue;
            }

            foreach (var handlerInterface in type.GetInterfaces())
            {
                if (handlerInterface.IsGenericType &&
                    handlerInterface.GetGenericTypeDefinition() == typeof(IRequestHandler<,>))
                {
                    services.AddScoped(handlerInterface, type);
                }
            }
        }

        return services;
    }
}
