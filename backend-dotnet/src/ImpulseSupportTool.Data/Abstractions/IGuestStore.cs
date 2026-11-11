using ImpulseSupportTool.Models.Access;

namespace ImpulseSupportTool.Data.Abstractions;

/// <summary>
/// Port for guest sign-in records.
/// </summary>
public interface IGuestStore
{
    Task<GuestLoginRecord> AddAsync(GuestLoginRecord record, CancellationToken cancellationToken);

    Task<GuestLoginRecord?> LatestByEmailAsync(string email, CancellationToken cancellationToken);
}
