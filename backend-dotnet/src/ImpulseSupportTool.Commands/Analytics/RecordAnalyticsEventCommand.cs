using System.Threading.Channels;
using ImpulseSupportTool.Data.Abstractions;
using ImpulseSupportTool.Models.Analytics;
using ImpulseSupportTool.Util.Messaging;
using ImpulseSupportTool.Util.Results;

namespace ImpulseSupportTool.Commands.Analytics;

/// <summary>
/// Command: validate a usage event and queue it for the background log writer.
/// </summary>
public sealed record RecordAnalyticsEventCommand(AnalyticsEventRequest Request) : ICommand<ApiResult>;

public sealed class RecordAnalyticsEventCommandHandler(IAnalyticsEventQueue queue)
    : ICommandHandler<RecordAnalyticsEventCommand, ApiResult>
{
    public async Task<ApiResult> Handle(RecordAnalyticsEventCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;

        if (string.IsNullOrWhiteSpace(request.SessionId) ||
            request.SessionId.Length > 100)
        {
            return ApiResult.Problem(400, new { message = "A valid sessionId is required." });
        }

        if (request.EventType == AnalyticsEventTypes.TabView)
        {
            if (request.Tab is null ||
                !AnalyticsTabNames.All.Contains(request.Tab) ||
                request.Outcome is not null)
            {
                return ApiResult.Problem(400, new { message = "Invalid tab-view event." });
            }
        }
        else if (request.EventType == AnalyticsEventTypes.OrderSearch)
        {
            if (request.Tab is not null ||
                request.Outcome is not ("success" or "failure"))
            {
                return ApiResult.Problem(400, new
                {
                    message = "Order-search events require a success or failure outcome."
                });
            }
        }
        else
        {
            return ApiResult.Problem(400, new { message = "Unsupported event type." });
        }

        var analyticsEvent = new AnalyticsEvent
        {
            TimestampUtc = DateTime.UtcNow,
            SessionId = request.SessionId,
            EventType = request.EventType,
            Tab = request.Tab,
            Outcome = request.Outcome
        };

        try
        {
            await queue.EnqueueAsync(analyticsEvent, cancellationToken);
            return ApiResult.Accepted(new { message = "Analytics event accepted." });
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            return ApiResult.Problem(503, new { message = "Event was not accepted." });
        }
        catch (ChannelClosedException)
        {
            return ApiResult.Problem(503, new { message = "Analytics service is unavailable." });
        }
    }
}
