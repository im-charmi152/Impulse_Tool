using System.Security.Cryptography;
using ImpulseSupportTool.Models.Requests;

namespace ImpulseSupportTool.Models.Access;

/// <summary>
/// Business rules for production access, approvals and password resets.
/// Shared by the command and query handlers.
/// </summary>
public static class AccessRules
{
    public static string? Validate(AccessUserRequest request)
    {
        if (request.Event is not ("approved" or "password_changed"))
        {
            return "Event must be approved or password_changed.";
        }

        if (!IsCompanyEmail(request.Email))
        {
            return "Only an @ingrammicro.com email ID can be used.";
        }

        if (string.IsNullOrEmpty(request.Password))
        {
            return "A password is required.";
        }

        return null;
    }

    public static bool IsEmail(string? email)
    {
        return IsCompanyEmail(email);
    }

    public static bool IsCompanyEmail(string? email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            return false;
        }

        var trimmed = email.Trim();
        var at = trimmed.IndexOf('@');
        if (at <= 0 || at != trimmed.LastIndexOf('@'))
        {
            return false;
        }

        return trimmed[(at + 1)..].Equals("ingrammicro.com", StringComparison.OrdinalIgnoreCase);
    }

    public static object ToProfile(UserAccessRecord record)
    {
        return new
        {
            email = record.Email,
            name = record.Name,
            country = record.Country,
            countries = SplitCountries(record.Country),
            role = record.Role,
            temporary = record.Temporary,
        };
    }

    public static ApprovalRequestRecord Copy(ApprovalRequestRecord current)
    {
        return new ApprovalRequestRecord
        {
            Id = current.Id,
            Email = current.Email,
            Name = current.Name,
            Country = current.Country,
            Role = current.Role,
            Kind = string.IsNullOrWhiteSpace(current.Kind) ? "access" : current.Kind,
            Status = current.Status,
            Note = current.Note,
            TemporaryPassword = current.TemporaryPassword,
            RequestedAt = current.RequestedAt,
            ApprovedAt = current.ApprovedAt,
            DeclinedAt = current.DeclinedAt,
        };
    }

    public static string NormalizeCountries(IEnumerable<string>? countries, string? country)
    {
        var tokens = new List<string>();
        if (countries is not null)
        {
            foreach (var item in countries)
            {
                if (!string.IsNullOrWhiteSpace(item))
                {
                    tokens.Add(item);
                }
            }
        }

        if (!string.IsNullOrWhiteSpace(country))
        {
            tokens.Add(country);
        }

        var unique = new List<string>();
        var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var token in tokens)
        {
            foreach (var part in token.Split([',', ';'], StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
            {
                var code = part.Trim().ToUpperInvariant();
                if (code.Length is < 2 or > 3 || !code.All(char.IsLetterOrDigit))
                {
                    continue;
                }

                if (seen.Add(code))
                {
                    unique.Add(code);
                }
            }
        }

        return string.Join(',', unique);
    }

    public static string AdditionalCountries(string? owned, string requested)
    {
        var have = new HashSet<string>(SplitCountries(owned), StringComparer.OrdinalIgnoreCase);
        var extra = SplitCountries(requested).Where(code => !have.Contains(code)).ToArray();
        return string.Join(',', extra);
    }

    public static string MergeCountries(string? current, string? added)
    {
        var merged = new List<string>();
        var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var code in SplitCountries(current).Concat(SplitCountries(added)))
        {
            if (seen.Add(code))
            {
                merged.Add(code);
            }
        }

        return string.Join(',', merged);
    }

    public static string[] SplitCountries(string? country)
    {
        if (string.IsNullOrWhiteSpace(country))
        {
            return [];
        }

        return country.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    }

    public static string NameFromEmail(string email)
    {
        var local = email.Split('@')[0];
        var parts = local.Split(['.', '_', '+', '-'], StringSplitOptions.RemoveEmptyEntries);
        return string.Join(' ', parts.Select(part =>
            part.Length == 0
                ? ""
                : char.ToUpperInvariant(part[0]) + part[1..].ToLowerInvariant()));
    }

    public static string TemporaryPassword()
    {
        const string alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
        const string digits = "23456789";
        var bytes = new byte[8];
        RandomNumberGenerator.Fill(bytes);
        char Pick(string set, int index) => set[bytes[index] % set.Length];
        return $"Tmp{Pick(digits, 0)}{Pick(alphabet, 1)}{Pick(alphabet, 2)}{Pick(alphabet, 3)}#{Pick(alphabet, 4)}{Pick(alphabet, 5)}{Pick(alphabet, 6)}{Pick(alphabet, 7)}";
    }
}
