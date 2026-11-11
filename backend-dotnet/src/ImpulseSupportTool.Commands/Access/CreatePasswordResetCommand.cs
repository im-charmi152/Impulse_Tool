using ImpulseSupportTool.Data.Abstractions;
using ImpulseSupportTool.Models.Access;
using ImpulseSupportTool.Models.Requests;
using ImpulseSupportTool.Util.Messaging;
using ImpulseSupportTool.Util.Results;
using static ImpulseSupportTool.Models.Access.AccessRules;

namespace ImpulseSupportTool.Commands.Access;

/// <summary>
/// Command: ask an admin to issue a new temporary password.
/// </summary>
public sealed record CreatePasswordResetCommand(PasswordResetRequest Request) : ICommand<ApiResult>;

public sealed class CreatePasswordResetCommandHandler(IUserAccessStore userAccess, IApprovalStore requests)
    : ICommandHandler<CreatePasswordResetCommand, ApiResult>
{
    public async Task<ApiResult> Handle(CreatePasswordResetCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;

        if (!IsCompanyEmail(request.Email))
        {
            return ApiResult.Problem(400, new { message = "Only an @ingrammicro.com email ID can be used." });
        }

        var email = request.Email.Trim().ToLowerInvariant();
        var user = await userAccess.LatestAsync(email, cancellationToken);
        if (user is null)
        {
            return ApiResult.Ok(new
            {
                status = "unknown",
                message = "This email does not have production access.",
            });
        }

        var existing = await requests.LatestByEmailAsync(email, "password_reset", cancellationToken);
        if (existing?.Status == "pending")
        {
            return ApiResult.Ok(new { status = "pending", request = existing });
        }

        var created = new ApprovalRequestRecord
        {
            Id = Guid.NewGuid().ToString(),
            Email = email,
            Name = string.IsNullOrWhiteSpace(user.Name) ? NameFromEmail(email) : user.Name,
            Country = user.Country,
            Role = user.Role,
            Kind = "password_reset",
            Status = "pending",
            RequestedAt = DateTimeOffset.UtcNow,
        };
        await requests.AppendAsync(created, cancellationToken);
        return ApiResult.Created(new { status = "created", request = created });
    }
}
