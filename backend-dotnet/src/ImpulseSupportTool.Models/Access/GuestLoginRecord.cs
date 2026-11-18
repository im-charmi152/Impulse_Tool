namespace ImpulseSupportTool.Models.Access;

public sealed class GuestLoginRecord
{
    public long Id { get; set; }

    public string Name { get; set; } = "";

    public string Email { get; set; } = "";

    public string Country { get; set; } = "";

    public string Role { get; set; } = "";

    public DateTimeOffset SignedInAt { get; set; }
}
