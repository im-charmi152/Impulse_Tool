using ImpulseSupportTool.Models.Analytics;

namespace ImpulseSupportTool.Data.Abstractions;

/// <summary>
/// Port for buffering analytics events before they are persisted in the background.
/// </summary>
public interface IAnalyticsEventQueue
{
    ValueTask EnqueueAsync(AnalyticsEvent analyticsEvent, CancellationToken cancellationToken);

    IAsyncEnumerable<AnalyticsEvent> ReadAllAsync(CancellationToken cancellationToken);
}
