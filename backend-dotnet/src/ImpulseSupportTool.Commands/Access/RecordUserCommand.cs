using ImpulseSupportTool.Data.Abstractions;
using ImpulseSupportTool.Models.Access;
using ImpulseSupportTool.Models.Requests;
using ImpulseSupportTool.Util.Messaging;
using ImpulseSupportTool.Util.Results;
using static ImpulseSupportTool.Models.Access.AccessRules;

namespace ImpulseSupportTool.Commands.Access;

/// <summary>
/// Command: record or update a production user (approved access or password change).
/// </summary>
public sealed record RecordUserCommand(AccessUserRequest Request) : ICommand<ApiResult>;

public sealed class RecordUserCommandHandler(IUserAccessStore userAccess)
    : ICommandHandler<RecordUserCommand, ApiResult>
{
    public async Task<ApiResult> Handle(RecordUserCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;

        var validationError = Validate(request);
        if (validationError is not null)
        {
            return ApiResult.Problem(400, new { message = validationError });
        }

        var record = new UserAccessRecord
        {
            Event = request.Event.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            Name = request.Name?.Trim() ?? "",
            Country = NormalizeCountries(request.Countries, request.Country),
            Role = request.Role?.Trim() ?? "",
            Password = request.Password,
            Temporary = request.Temporary,
            At = DateTimeOffset.UtcNow,
        };

        await userAccess.AppendAsync(record, cancellationToken);
        return ApiResult.Ok(ToProfile(record));
    }
}
