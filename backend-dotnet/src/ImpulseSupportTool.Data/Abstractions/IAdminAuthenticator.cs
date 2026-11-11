namespace ImpulseSupportTool.Data.Abstractions;

/// <summary>
/// Port for verifying administrator logins against the encrypted admin vault.
/// </summary>
public interface IAdminAuthenticator
{
    bool IsReady { get; }

    bool Authenticate(string email, string password);
}
