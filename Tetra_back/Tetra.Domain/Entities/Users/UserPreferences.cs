namespace Tetra.Domain.Entities.Users;

public class UserPreferences : BaseEntity, IUpdatable
{
    public string UserId { get; set; }
    public User User { get; set; }

    public int AccentHue { get; set; } = 200;
    public Theme? Theme { get; set; } = Enums.Theme.System;
    public string? Language { get; set; } = Languages.En;

    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
}