using System.Globalization;

namespace ImpulseSupportTool.Queries.Analytics;

/// <summary>
/// Validates the startDate/endDate or days parameters used by the analytics reports.
/// </summary>
public static class AnalyticsDateRange
{
    public static bool TryResolve(
        string? startDateText,
        string? endDateText,
        int days,
        out DateTime startDate,
        out DateTime endDate,
        out string? error)
    {
        error = null;
        var hasStart = !string.IsNullOrWhiteSpace(startDateText);
        var hasEnd = !string.IsNullOrWhiteSpace(endDateText);

        if (hasStart != hasEnd)
        {
            startDate = endDate = default;
            error = "Provide both startDate and endDate, using yyyy-MM-dd.";
            return false;
        }

        if (hasStart && hasEnd)
        {
            if (!DateOnly.TryParseExact(startDateText, "yyyy-MM-dd",
                    CultureInfo.InvariantCulture, DateTimeStyles.None, out var start) ||
                !DateOnly.TryParseExact(endDateText, "yyyy-MM-dd",
                    CultureInfo.InvariantCulture, DateTimeStyles.None, out var end))
            {
                startDate = endDate = default;
                error = "Use yyyy-MM-dd for startDate and endDate.";
                return false;
            }

            startDate = start.ToDateTime(TimeOnly.MinValue);
            endDate = end.ToDateTime(TimeOnly.MinValue);
            if (startDate > endDate)
            {
                error = "startDate must be on or before endDate.";
                return false;
            }

            if (endDate.Date > DateTime.UtcNow.Date)
            {
                error = "Future dates are not supported.";
                return false;
            }

            if ((endDate - startDate).TotalDays >= 365)
            {
                error = "The selected date range must be 365 days or less.";
                return false;
            }

            return true;
        }

        if (days < 1 || days > 365)
        {
            startDate = endDate = default;
            error = "days must be between 1 and 365.";
            return false;
        }

        endDate = DateTime.UtcNow.Date;
        startDate = endDate.AddDays(-(days - 1));
        return true;
    }
}
