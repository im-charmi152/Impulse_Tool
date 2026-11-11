using ImpulseSupportTool.Data.Abstractions;
using ImpulseSupportTool.Models.Access;
using ImpulseSupportTool.Models.Requests;
using ImpulseSupportTool.Util.Messaging;
using ImpulseSupportTool.Util.Results;
using static ImpulseSupportTool.Models.Access.AccessRules;

namespace ImpulseSupportTool.Commands.Access;

/// <summary>
/// Command: submit a production access request for approval.
/// </summary>
public sealed record CreateApprovalRequestCommand(ApprovalSubmitRequest Request) : ICommand<ApiResult>;

public sealed class CreateApprovalRequestCommandHandler(IApprovalStore requests, IUserAccessStore userAccess)
    : ICommandHandler<CreateApprovalRequestCommand, ApiResult>
{
    public async Task<ApiResult> Handle(CreateApprovalRequestCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;

        if (!IsCompanyEmail(request.Email))
        {
            return ApiResult.Problem(400, new { message = "Only an @ingrammicro.com email ID can be used." });
        }

        var countries = NormalizeCountries(request.Countries, request.Country);
        if (countries.Length == 0 || string.IsNullOrWhiteSpace(request.Role))
        {
            return ApiResult.Problem(400, new { message = "Select at least one country and a role." });
        }

        var email = request.Email.Trim().ToLowerInvariant();
        var existing = await requests.LatestByEmailAsync(email, "access", cancellationToken);
        if (existing?.Status == "pending")
        {
            return ApiResult.Ok(new { status = "pending", request = existing });
        }

        if (existing?.Status == "declined" && !request.ReplaceDeclined)
        {
            return ApiResult.Ok(new { status = "declined", request = existing });
        }

        var existingUser = await userAccess.LatestAsync(email, cancellationToken);
        var requestedCountries = AdditionalCountries(existingUser?.Country, countries);
        if (existingUser is not null && requestedCountries.Length == 0)
        {
            return ApiResult.Ok(new
            {
                status = "already-have",
                countries = SplitCountries(existingUser.Country),
                message = "The selected countries already have production access.",
            });
        }

        var created = new ApprovalRequestRecord
        {
            Id = Guid.NewGuid().ToString(),
            Email = email,
            Name = string.IsNullOrWhiteSpace(existingUser?.Name)
                ? (string.IsNullOrWhiteSpace(request.Name) ? NameFromEmail(email) : request.Name.Trim())
                : existingUser.Name,
            Country = existingUser is null ? countries : requestedCountries,
            Role = string.IsNullOrWhiteSpace(existingUser?.Role) ? request.Role.Trim() : existingUser.Role,
            Kind = "access",
            Status = "pending",
            RequestedAt = DateTimeOffset.UtcNow,
        };
        await requests.AppendAsync(created, cancellationToken);
        return ApiResult.Created(new { status = "created", request = created });
    }
}
