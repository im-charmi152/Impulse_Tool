namespace ImpulseSupportTool.Util.Messaging;

/// <summary>
/// Handles a command (write side of CQRS).
/// </summary>
public interface ICommandHandler<in TCommand, TResponse> : IRequestHandler<TCommand, TResponse>
    where TCommand : ICommand<TResponse>
{
}
