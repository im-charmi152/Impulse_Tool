using System.Globalization;
using System.Text.Json;
using ImpulseSupportTool.Models.Analytics;
using ImpulseSupportTool.Util.Messaging;
using ImpulseSupportTool.Util.Results;

namespace ImpulseSupportTool.Queries.Analytics;

// ---------------------------------------------------------------------------
// Summary of tab views and order searches over a date range
// ---------------------------------------------------------------------------
public sealed record GetAnalyticsSummaryQuery(int Days, string? StartDate, string? EndDate) : IQuery<ApiResult>;

public sealed class GetAnalyticsSummaryQueryHandler(AnalyticsLogLocation location)
    : IQueryHandler<GetAnalyticsSummaryQuery, ApiResult>
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task<ApiResult> Handle(GetAnalyticsSummaryQuery query, CancellationToken cancellationToken)
    {
        if (!AnalyticsDateRange.TryResolve(query.StartDate, query.EndDate, query.Days,
                out var rangeStart, out var rangeEnd, out var rangeError))
        {
            return ApiResult.Problem(400, new { message = rangeError });
        }

        var startDateValue = rangeStart;
        var today = rangeEnd;

        var tabCounts = new Dictionary<string, int>();
        var tabSessions = new Dictionary<string, HashSet<string>>();
        var dailyCounts = new SortedDictionary<string, int>();

        var totalTabViews = 0;
        var totalSearches = 0;
        var successfulSearches = 0;
        var failedSearches = 0;

        for (var date = startDateValue; date <= today; date = date.AddDays(1))
        {
            cancellationToken.ThrowIfCancellationRequested();

            var dateKey = date.ToString("yyyy-MM-dd");
            var filePath = location.GetLogPath(dateKey);
            var dailyTabViews = 0;

            if (System.IO.File.Exists(filePath))
            {
                using var stream = new FileStream(
                    filePath,
                    FileMode.Open,
                    FileAccess.Read,
                    FileShare.ReadWrite | FileShare.Delete,
                    4096,
                    FileOptions.Asynchronous |
                    FileOptions.SequentialScan);

                using var reader = new StreamReader(stream);

                while (await reader.ReadLineAsync(cancellationToken)
                    is { } line)
                {
                    try
                    {
                        var item = JsonSerializer.Deserialize<AnalyticsEvent>(line, JsonOptions);

                        if (item is null)
                            continue;

                        if (item.EventType == AnalyticsEventTypes.TabView &&
                            item.Tab is not null &&
                            AnalyticsTabNames.All.Contains(item.Tab))
                        {
                            totalTabViews++;
                            dailyTabViews++;

                            tabCounts[item.Tab] =
                                tabCounts.GetValueOrDefault(item.Tab) + 1;

                            if (!tabSessions.TryGetValue(item.Tab, out var sessions))
                            {
                                sessions = new HashSet<string>(StringComparer.Ordinal);
                                tabSessions[item.Tab] = sessions;
                            }

                            sessions.Add(item.SessionId);
                        }
                        else if (item.EventType == AnalyticsEventTypes.OrderSearch)
                        {
                            totalSearches++;

                            if (item.Outcome == "success")
                                successfulSearches++;
                            else if (item.Outcome == "failure")
                                failedSearches++;
                        }
                    }
                    catch (JsonException)
                    {
                        // Skip malformed lines and continue reading.
                    }
                }
            }

            dailyCounts[dateKey] = dailyTabViews;
        }

        var tabs = AnalyticsTabNames.All
            .Select(tab => new
            {
                tab,
                views = tabCounts.GetValueOrDefault(tab),
                uniqueSessions = tabSessions.TryGetValue(tab, out var sessions)
                    ? sessions.Count
                    : 0
            })
            .OrderByDescending(x => x.views)
            .ToList();

        return ApiResult.Ok(new
        {
            startDate = startDateValue.ToString("yyyy-MM-dd"),
            endDate = today.ToString("yyyy-MM-dd"),
            totalTabViews,
            totalSearches,
            successfulSearches,
            failedSearches,
            tabs,
            dailyActivity = dailyCounts.Select(x => new
            {
                date = x.Key,
                tabViews = x.Value
            })
        });
    }
}

// ---------------------------------------------------------------------------
// Tab views per day over a date range
// ---------------------------------------------------------------------------
public sealed record GetAnalyticsDailyQuery(int Days, string? StartDate, string? EndDate) : IQuery<ApiResult>;

public sealed class GetAnalyticsDailyQueryHandler(AnalyticsLogLocation location)
    : IQueryHandler<GetAnalyticsDailyQuery, ApiResult>
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task<ApiResult> Handle(GetAnalyticsDailyQuery query, CancellationToken cancellationToken)
    {
        if (!AnalyticsDateRange.TryResolve(query.StartDate, query.EndDate, query.Days,
                out var rangeStart, out var rangeEnd, out var rangeError))
        {
            return ApiResult.Problem(400, new { message = rangeError });
        }

        var today = rangeEnd;
        var results = new List<object>();

        for (var date = rangeStart; date <= today; date = date.AddDays(1))
        {
            cancellationToken.ThrowIfCancellationRequested();

            var path = location.GetLogPath(date.ToString("yyyy-MM-dd"));
            var counts = new Dictionary<string, int>();

            if (System.IO.File.Exists(path))
            {
                using var stream = new FileStream(
                    path,
                    FileMode.Open,
                    FileAccess.Read,
                    FileShare.ReadWrite | FileShare.Delete,
                    4096,
                    FileOptions.Asynchronous |
                    FileOptions.SequentialScan);

                using var reader = new StreamReader(stream);

                while (await reader.ReadLineAsync(cancellationToken)
                    is { } line)
                {
                    try
                    {
                        var item = JsonSerializer.Deserialize<AnalyticsEvent>(line, JsonOptions);

                        if (item?.EventType == AnalyticsEventTypes.TabView &&
                            item.Tab is not null &&
                            AnalyticsTabNames.All.Contains(item.Tab))
                        {
                            counts[item.Tab] = counts.GetValueOrDefault(item.Tab) + 1;
                        }
                    }
                    catch (JsonException)
                    {
                        // Ignore malformed lines.
                    }
                }
            }

            results.Add(new
            {
                date = date.ToString("yyyy-MM-dd"),
                totalTabViews = counts.Values.Sum(),
                tabs = counts
            });
        }

        return ApiResult.Ok(results);
    }
}

// ---------------------------------------------------------------------------
// Download one day's raw JSONL log
// ---------------------------------------------------------------------------
public sealed record ExportAnalyticsLogQuery(string? Date) : IQuery<ApiResult>;

public sealed class ExportAnalyticsLogQueryHandler(AnalyticsLogLocation location)
    : IQueryHandler<ExportAnalyticsLogQuery, ApiResult>
{
    public Task<ApiResult> Handle(ExportAnalyticsLogQuery query, CancellationToken cancellationToken)
        => Task.FromResult(Export(query.Date));

    private ApiResult Export(string? date)
    {
        if (!DateOnly.TryParseExact(
            date,
            "yyyy-MM-dd",
            CultureInfo.InvariantCulture,
            DateTimeStyles.None,
            out var selectedDate))
        {
            return ApiResult.Problem(400, new { message = "Use date format yyyy-MM-dd." });
        }

        var path = location.GetLogPath(selectedDate.ToString("yyyy-MM-dd"));

        if (!System.IO.File.Exists(path))
        {
            return ApiResult.Problem(404, new { message = "No log exists for the selected date." });
        }

        return ApiResult.File(path, "application/x-ndjson", Path.GetFileName(path));
    }
}

// ---------------------------------------------------------------------------
// The five most recent tab views (for this session when possible)
// ---------------------------------------------------------------------------
public sealed record GetRecentAnalyticsTabsQuery(string? SessionId) : IQuery<ApiResult>;

public sealed class GetRecentAnalyticsTabsQueryHandler(AnalyticsLogLocation location)
    : IQueryHandler<GetRecentAnalyticsTabsQuery, ApiResult>
{
    public async Task<ApiResult> Handle(GetRecentAnalyticsTabsQuery query, CancellationToken cancellationToken)
    {
        var sessionId = query.SessionId;
        if (string.IsNullOrWhiteSpace(sessionId) || sessionId.Length > 100)
        {
            return ApiResult.Problem(400, new { message = "A valid sessionId is required." });
        }

        if (!Directory.Exists(location.Root))
        {
            return ApiResult.Ok(new
            {
                count = 0,
                recentTabs = Array.Empty<object>()
            });
        }

        var events = new List<AnalyticsEvent>();
        var sessionEvents = new List<AnalyticsEvent>();

        var logFiles = Directory.GetFiles(location.Root, "radius-usage-*.jsonl");

        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        foreach (var file in logFiles)
        {
            var lines = await System.IO.File.ReadAllLinesAsync(file, cancellationToken);

            foreach (var line in lines)
            {
                if (string.IsNullOrWhiteSpace(line))
                    continue;

                try
                {
                    var analyticsEvent = JsonSerializer.Deserialize<AnalyticsEvent>(line, jsonOptions);

                    if (analyticsEvent != null &&
                        string.Equals(analyticsEvent.EventType, "tab_view", StringComparison.OrdinalIgnoreCase) &&
                        !string.IsNullOrWhiteSpace(analyticsEvent.Tab))
                    {
                        events.Add(analyticsEvent);
                        if (string.Equals(analyticsEvent.SessionId, sessionId, StringComparison.Ordinal))
                        {
                            sessionEvents.Add(analyticsEvent);
                        }
                    }
                }
                catch (JsonException)
                {
                    // Skip malformed log entries.
                }
            }
        }

        var source = sessionEvents.Count > 0 ? sessionEvents : events;
        var recentTabs = source
            .OrderByDescending(e => e.TimestampUtc)
            .Take(5)
            .Select(e => new
            {
                tab = e.Tab,
                sessionId = e.SessionId,
                timestampUtc = e.TimestampUtc
            })
            .ToList();

        return ApiResult.Ok(new
        {
            count = recentTabs.Count,
            recentTabs
        });
    }
}
