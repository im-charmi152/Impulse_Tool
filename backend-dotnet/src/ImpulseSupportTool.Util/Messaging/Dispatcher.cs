using System.Reflection;
using System.Runtime.ExceptionServices;
using ImpulseSupportTool.Util.Messaging;

namespace ImpulseSupportTool.Util.Messaging;

/// <summary>
/// Resolves the <see cref="IRequestHandler{TRequest,TResponse}"/> registered for a request
/// and invokes it. Lightweight CQRS dispatcher with no third-party dependency.
/// </summary>
public sealed class Dispatcher(IServiceProvider services) : IDispatcher
{
    public async Task<TResponse> Send<TResponse>(
        IRequest<TResponse> request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var requestType = request.GetType();
        var handlerType = typeof(IRequestHandler<,>).MakeGenericType(requestType, typeof(TResponse));
        var handler = services.GetService(handlerType)
            ?? throw new InvalidOperationException(
                $"No handler is registered for request '{requestType.Name}'.");

        var handle = handlerType.GetMethod("Handle")!;
        try
        {
            var task = (Task<TResponse>)handle.Invoke(handler, [request, cancellationToken])!;
            return await task;
        }
        catch (TargetInvocationException ex) when (ex.InnerException is not null)
        {
            ExceptionDispatchInfo.Capture(ex.InnerException).Throw();
            throw;
        }
    }
}
