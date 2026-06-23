namespace Tetra.Domain.Entities.Users;

public class UserNotificationSettings : BaseEntity, IUpdatable
{
    public string UserId { get; set; }
    public User User { get; set; }

    public NotificationType Type { get; set; }

    public bool IsMailEnabled { get; set; }
    public bool IsPushEnabled { get; set; }

    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
}