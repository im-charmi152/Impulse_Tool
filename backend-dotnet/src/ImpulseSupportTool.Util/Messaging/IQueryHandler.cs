namespace ImpulseSupportTool.Util.Messaging;

/// <summary>
/// Handles a query (read side of CQRS).
/// </summary>
public interface IQueryHandler<in TQuery, TResponse> : IRequestHandler<TQuery, TResponse>
    where TQuery : IQuery<TResponse>
{
}
