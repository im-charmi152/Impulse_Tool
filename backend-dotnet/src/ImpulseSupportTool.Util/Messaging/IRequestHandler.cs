namespace ImpulseSupportTool.Util.Messaging;

/// <summary>
/// Handles one request type and returns its response.
/// </summary>
public interface IRequestHandler<in TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken);
}
