using ImpulseSupportTool.Data.Abstractions;
using ImpulseSupportTool.Models.Access;
using ImpulseSupportTool.Util.Messaging;
using ImpulseSupportTool.Util.Results;
using static ImpulseSupportTool.Models.Access.AccessRules;

namespace ImpulseSupportTool.Commands.Access;

/// <summary>
/// Command: approve a pending access or password-reset request.
/// </summary>
public sealed record ApproveRequestCommand(string Id) : ICommand<ApiResult>;

public sealed class ApproveRequestCommandHandler(IApprovalStore requests, IUserAccessStore userAccess)
    : ICommandHandler<ApproveRequestCommand, ApiResult>
{
    public async Task<ApiResult> Handle(ApproveRequestCommand command, CancellationToken cancellationToken)
    {
        var current = await requests.LatestByIdAsync(command.Id, cancellationToken);
        if (current is null || current.Status != "pending")
        {
            return ApiResult.Problem(404, new { message = "This approval request was not found." });
        }

        var existingUser = await userAccess.LatestAsync(current.Email, cancellationToken);
        var isReset = string.Equals(current.Kind, "password_reset", StringComparison.OrdinalIgnoreCase);
        if (isReset && existingUser is null)
        {
            return ApiResult.Problem(404, new { message = "This email does not have production access." });
        }

        var mergedCountries = isReset
            ? existingUser!.Country
            : MergeCountries(existingUser?.Country, current.Country);
        var password = existingUser?.Password ?? "";
        var temporary = existingUser?.Temporary ?? true;
        var issuedPassword = "";
        if (isReset || string.IsNullOrEmpty(password))
        {
            password = TemporaryPassword();
            temporary = true;
            issuedPassword = password;
        }

        await userAccess.AppendAsync(new UserAccessRecord
        {
            Event = "approved",
            Email = current.Email,
            Name = string.IsNullOrWhiteSpace(existingUser?.Name) ? current.Name : existingUser.Name,
            Country = mergedCountries,
            Role = string.IsNullOrWhiteSpace(existingUser?.Role) ? current.Role : existingUser.Role,
            Password = password,
            Temporary = temporary,
            At = DateTimeOffset.UtcNow,
        }, cancellationToken);

        var approved = Copy(current);
        approved.Status = "approved";
        approved.TemporaryPassword = issuedPassword;
        approved.Note = isReset
            ? "New temporary password created."
            : existingUser is null
                ? current.Note
                : "Existing production access kept. These countries were added.";
        approved.ApprovedAt = DateTimeOffset.UtcNow;
        await requests.AppendAsync(approved, cancellationToken);
        return ApiResult.Ok(approved);
    }
}
