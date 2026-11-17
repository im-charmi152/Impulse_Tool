using System.Threading.Channels;
using ImpulseSupportTool.Data.Abstractions;
using ImpulseSupportTool.Models.Options;
using ImpulseSupportTool.Models.Analytics;

namespace ImpulseSupportTool.Data.Analytics;

/// <summary>
/// In-memory bounded queue backed by a <see cref="Channel{T}"/>.
/// Replaces the old AnalyticsQueue, which exposed the raw Channel to callers.
/// </summary>
public sealed class ChannelAnalyticsEventQueue : IAnalyticsEventQueue
{
    private readonly Channel<AnalyticsEvent> _channel;

    public ChannelAnalyticsEventQueue(AnalyticsOptions options)
    {
        if (options.QueueCapacity < 1)
        {
            throw new ArgumentOutOfRangeException(nameof(options.QueueCapacity));
        }

        _channel = Channel.CreateBounded<AnalyticsEvent>(
            new BoundedChannelOptions(options.QueueCapacity)
            {
                FullMode = BoundedChannelFullMode.Wait,
                SingleReader = true,
                SingleWriter = false,
                AllowSynchronousContinuations = false
            });
    }

    public ValueTask EnqueueAsync(AnalyticsEvent analyticsEvent, CancellationToken cancellationToken)
        => _channel.Writer.WriteAsync(analyticsEvent, cancellationToken);

    public IAsyncEnumerable<AnalyticsEvent> ReadAllAsync(CancellationToken cancellationToken)
        => _channel.Reader.ReadAllAsync(cancellationToken);
}
