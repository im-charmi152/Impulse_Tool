namespace ImpulseSupportTool.Util.Messaging;

/// <summary>
/// A request that changes state (create, update, delete, record).
/// </summary>
public interface ICommand<out TResponse> : IRequest<TResponse>
{
}
