using ImpulseSupportTool.Models.Access;

namespace ImpulseSupportTool.Data.Abstractions;

/// <summary>
/// Port for the approved user access log.
/// </summary>
public interface IUserAccessStore
{
    Task AppendAsync(UserAccessRecord record, CancellationToken cancellationToken);

    Task<UserAccessRecord?> LatestAsync(string email, CancellationToken cancellationToken);
}
