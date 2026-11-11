namespace ImpulseSupportTool.Util.Messaging;

/// <summary>
/// Marker for any request (query or command) sent through <see cref="IDispatcher"/>.
/// </summary>
public interface IRequest<out TResponse>
{
}
