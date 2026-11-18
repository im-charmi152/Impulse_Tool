namespace ImpulseSupportTool.Util.Messaging;

/// <summary>
/// Sends queries and commands to their registered handlers. Controllers depend on this
/// instead of on repositories or services directly.
/// </summary>
public interface IDispatcher
{
    Task<TResponse> Send<TResponse>(IRequest<TResponse> request, CancellationToken cancellationToken = default);
}
