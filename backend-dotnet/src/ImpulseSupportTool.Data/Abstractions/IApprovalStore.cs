using ImpulseSupportTool.Models.Access;

namespace ImpulseSupportTool.Data.Abstractions;

/// <summary>
/// Port for access, password-reset and other approval requests.
/// </summary>
public interface IApprovalStore
{
    Task AppendAsync(ApprovalRequestRecord record, CancellationToken cancellationToken);

    Task<IReadOnlyList<ApprovalRequestRecord>> ListLatestAsync(CancellationToken cancellationToken);

    Task<ApprovalRequestRecord?> LatestByEmailAsync(string email, string kind, CancellationToken cancellationToken);

    Task<ApprovalRequestRecord?> LatestByIdAsync(string id, CancellationToken cancellationToken);
}
