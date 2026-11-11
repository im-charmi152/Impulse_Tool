using ImpulseSupportTool.Api.Extensions;
using ImpulseSupportTool.Commands.Access;
using ImpulseSupportTool.Models.Requests;
using ImpulseSupportTool.Queries.Access;
using ImpulseSupportTool.Util.Messaging;
using Microsoft.AspNetCore.Mvc;

namespace ImpulseSupportTool.Api.Controllers;

/// <summary>
/// Thin HTTP layer: maps each route to a command or query and returns its result.
/// </summary>
[ApiController]
[Route("api/access")]
public sealed class AccessController(IDispatcher dispatcher) : ControllerBase
{
    [HttpPost("users")]
    public async Task<IActionResult> RecordUser(
        [FromBody] AccessUserRequest request,
        CancellationToken cancellationToken)
        => (await dispatcher.Send(new RecordUserCommand(request), cancellationToken)).ToActionResult(this);

    [HttpGet("users")]
    public async Task<IActionResult> FindUser(
        [FromQuery] string email,
        CancellationToken cancellationToken)
        => (await dispatcher.Send(new FindUserQuery(email), cancellationToken)).ToActionResult(this);

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromBody] AccessLoginRequest request,
        CancellationToken cancellationToken)
        => (await dispatcher.Send(new LoginQuery(request), cancellationToken)).ToActionResult(this);

    [HttpPost("admin-login")]
    public async Task<IActionResult> AdminLogin([FromBody] AccessLoginRequest request)
        => (await dispatcher.Send(new AdminLoginQuery(request))).ToActionResult(this);

    [HttpPost("guests")]
    public async Task<IActionResult> RecordGuest(
        [FromBody] GuestLoginRequest request,
        CancellationToken cancellationToken)
        => (await dispatcher.Send(new RecordGuestCommand(request), cancellationToken)).ToActionResult(this);

    [HttpGet("guests")]
    public async Task<IActionResult> FindGuest(
        [FromQuery] string email,
        CancellationToken cancellationToken)
        => (await dispatcher.Send(new FindGuestQuery(email), cancellationToken)).ToActionResult(this);

    [HttpGet("requests")]
    public async Task<IActionResult> ListRequests(CancellationToken cancellationToken)
        => (await dispatcher.Send(new ListRequestsQuery(), cancellationToken)).ToActionResult(this);

    [HttpPost("requests")]
    public async Task<IActionResult> CreateRequest(
        [FromBody] ApprovalSubmitRequest request,
        CancellationToken cancellationToken)
        => (await dispatcher.Send(new CreateApprovalRequestCommand(request), cancellationToken)).ToActionResult(this);

    [HttpPost("requests/{id}/approve")]
    public async Task<IActionResult> ApproveRequest(string id, CancellationToken cancellationToken)
        => (await dispatcher.Send(new ApproveRequestCommand(id), cancellationToken)).ToActionResult(this);

    [HttpPost("requests/{id}/decline")]
    public async Task<IActionResult> DeclineRequest(
        string id,
        [FromBody] ApprovalDeclineRequest request,
        CancellationToken cancellationToken)
        => (await dispatcher.Send(new DeclineRequestCommand(id, request), cancellationToken)).ToActionResult(this);

    [HttpPost("password-resets")]
    public async Task<IActionResult> CreatePasswordReset(
        [FromBody] PasswordResetRequest request,
        CancellationToken cancellationToken)
        => (await dispatcher.Send(new CreatePasswordResetCommand(request), cancellationToken)).ToActionResult(this);
}
