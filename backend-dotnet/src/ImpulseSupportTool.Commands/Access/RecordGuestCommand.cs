using ImpulseSupportTool.Data.Abstractions;
using ImpulseSupportTool.Models.Access;
using ImpulseSupportTool.Models.Requests;
using ImpulseSupportTool.Util.Messaging;
using ImpulseSupportTool.Util.Results;
using static ImpulseSupportTool.Models.Access.AccessRules;

namespace ImpulseSupportTool.Commands.Access;

/// <summary>
/// Command: record a guest sign-in.
/// </summary>
public sealed record RecordGuestCommand(GuestLoginRequest Request) : ICommand<ApiResult>;

public sealed class RecordGuestCommandHandler(IGuestStore guests)
    : ICommandHandler<RecordGuestCommand, ApiResult>
{
    public async Task<ApiResult> Handle(RecordGuestCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;

        if (!IsCompanyEmail(request.Email))
        {
            return ApiResult.Problem(400, new { message = "Only an @ingrammicro.com email ID can be used." });
        }

        if (string.IsNullOrWhiteSpace(request.Name) ||
            string.IsNullOrWhiteSpace(request.Country) ||
            string.IsNullOrWhiteSpace(request.Role))
        {
            return ApiResult.Problem(400, new { message = "Name, country, and role are required." });
        }

        var saved = await guests.AddAsync(new GuestLoginRecord
        {
            Name = request.Name.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            Country = request.Country.Trim(),
            Role = request.Role.Trim(),
            SignedInAt = DateTimeOffset.UtcNow,
        }, cancellationToken);

        return ApiResult.Created(saved);
    }
}
