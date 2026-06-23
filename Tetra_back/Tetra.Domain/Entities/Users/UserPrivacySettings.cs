namespace Tetra.Domain.Entities.Users;

public class UserPrivacySettings : BaseEntity, IUpdatable
{
    public string UserId { get; set; }
    public User User { get; set; }

    public MessagePermission MessagePermission { get; set; } = MessagePermission.Everyone;
    public bool ReadReceiptEnabled { get; set; }
    public bool InvisibleBrowsingEnabled { get; set; }
    public bool ActivityStatusEnabled { get; set; }
    public LastSeenVisibility LastSeenVisibility { get; set; } = LastSeenVisibility.Everyone;

    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
}