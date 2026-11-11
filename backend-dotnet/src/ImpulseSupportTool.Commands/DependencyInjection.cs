using ImpulseSupportTool.Commands.Access;
using ImpulseSupportTool.Util;
using Microsoft.Extensions.DependencyInjection;

namespace ImpulseSupportTool.Commands;

public static class DependencyInjection
{
    /// <summary>
    /// Registers every command handler in this assembly.
    /// </summary>
    public static IServiceCollection AddCommands(this IServiceCollection services)
    {
        return services.AddRequestHandlers(typeof(RecordUserCommandHandler).Assembly);
    }
}
