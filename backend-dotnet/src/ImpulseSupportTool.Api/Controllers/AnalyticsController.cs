using ImpulseSupportTool.Api.Extensions;
using ImpulseSupportTool.Commands.Analytics;
using ImpulseSupportTool.Models.Analytics;
using ImpulseSupportTool.Queries.Analytics;
using ImpulseSupportTool.Util.Messaging;
using Microsoft.AspNetCore.Mvc;

namespace ImpulseSupportTool.Api.Controllers;

[ApiController]
[Route("api/analytics")]
public sealed class AnalyticsController(IDispatcher dispatcher) : ControllerBase
{
    // POST /api/analytics/events
    [HttpPost("events")]
    public async Task<IActionResult> RecordEvent(
        [FromBody] AnalyticsEventRequest request,
        CancellationToken cancellationToken)
        => (await dispatcher.Send(new RecordAnalyticsEventCommand(request), cancellationToken)).ToActionResult(this);

    // GET /api/analytics/summary?days=30
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary(
        [FromQuery] int days = 30,
        [FromQuery] string? startDate = null,
        [FromQuery] string? endDate = null,
        CancellationToken cancellationToken = default)
        => (await dispatcher.Send(new GetAnalyticsSummaryQuery(days, startDate, endDate), cancellationToken)).ToActionResult(this);

    // GET /api/analytics/daily?days=7
    [HttpGet("daily")]
    public async Task<IActionResult> GetDaily(
        [FromQuery] int days = 7,
        [FromQuery] string? startDate = null,
        [FromQuery] string? endDate = null,
        CancellationToken cancellationToken = default)
        => (await dispatcher.Send(new GetAnalyticsDailyQuery(days, startDate, endDate), cancellationToken)).ToActionResult(this);

    // GET /api/analytics/export?date=2026-10-14
    [HttpGet("export")]
    public async Task<IActionResult> Export([FromQuery] string? date)
        => (await dispatcher.Send(new ExportAnalyticsLogQuery(date))).ToActionResult(this);

    // GET /api/analytics/recent-tabs?sessionId=...
    [HttpGet("recent-tabs")]
    public async Task<IActionResult> GetRecentTabs(
        [FromQuery] string? sessionId,
        CancellationToken cancellationToken = default)
        => (await dispatcher.Send(new GetRecentAnalyticsTabsQuery(sessionId), cancellationToken)).ToActionResult(this);
}
