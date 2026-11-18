using ImpulseSupportTool.Models.Options;

namespace ImpulseSupportTool.Queries.Analytics;

/// <summary>
/// Resolves where the daily analytics JSONL files are stored.
/// </summary>
public sealed class AnalyticsLogLocation
{
    public AnalyticsLogLocation(AnalyticsOptions options)
    {
        var configured = options.LogDirectory;

        Root = Path.IsPathRooted(configured)
            ? configured
            : Path.Combine(AppContext.BaseDirectory, configured);
    }

    public string Root { get; }

    public string GetLogPath(string date)
    {
        // Date is generated internally or validated as yyyy-MM-dd.
        return Path.Combine(Root, $"radius-usage-{date}.jsonl");
    }
}
