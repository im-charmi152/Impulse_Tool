namespace ImpulseSupportTool.Models.Requests;

public sealed class ApprovalSubmitRequest
{
    public string Email { get; set; } = "";

    public string? Name { get; set; }

    public string? Country { get; set; }

    public List<string>? Countries { get; set; }

    public string? Role { get; set; }

    public bool ReplaceDeclined { get; set; }
}

public sealed class PasswordResetRequest
{
    public string Email { get; set; } = "";
}

public sealed class ApprovalDeclineRequest
{
    public string? Note { get; set; }
}

public sealed class GuestLoginRequest
{
    public string? Name { get; set; }

    public string Email { get; set; } = "";

    public string? Country { get; set; }

    public string? Role { get; set; }
}

public sealed class AccessUserRequest
{
    public string Event { get; set; } = "";

    public string Email { get; set; } = "";

    public string? Name { get; set; }

    public string? Country { get; set; }

    public List<string>? Countries { get; set; }

    public string? Role { get; set; }

    public string Password { get; set; } = "";

    public bool Temporary { get; set; }
}

public sealed class AccessLoginRequest
{
    public string Email { get; set; } = "";

    public string Password { get; set; } = "";
}
