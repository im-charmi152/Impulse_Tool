using ImpulseSupportTool.Data.Abstractions;
using ImpulseSupportTool.Models.Requests;
using ImpulseSupportTool.Util.Messaging;
using ImpulseSupportTool.Util.Results;
using static ImpulseSupportTool.Models.Access.AccessRules;

namespace ImpulseSupportTool.Commands.Access;

/// <summary>
/// Command: decline a pending request. A note is required.
/// </summary>
public sealed record DeclineRequestCommand(string Id, ApprovalDeclineRequest Request) : ICommand<ApiResult>;

public sealed class DeclineRequestCommandHandler(IApprovalStore requests)
    : ICommandHandler<DeclineRequestCommand, ApiResult>
{
    public async Task<ApiResult> Handle(DeclineRequestCommand command, CancellationToken cancellationToken)
    {
        var note = command.Request.Note?.Trim() ?? "";
        if (note.Length == 0)
        {
            return ApiResult.Problem(400, new { message = "Add a note before declining this request." });
        }

        var current = await requests.LatestByIdAsync(command.Id, cancellationToken);
        if (current is null || current.Status != "pending")
        {
            return ApiResult.Problem(404, new { message = "This approval request was not found." });
        }

        var declined = Copy(current);
        declined.Status = "declined";
        declined.Note = note;
        declined.DeclinedAt = DateTimeOffset.UtcNow;
        await requests.AppendAsync(declined, cancellationToken);
        return ApiResult.Ok(declined);
    }
}
