namespace ImpulseSupportTool.Util.Messaging;

/// <summary>
/// A read-only request. Queries never change state.
/// </summary>
public interface IQuery<out TResponse> : IRequest<TResponse>
{
}
