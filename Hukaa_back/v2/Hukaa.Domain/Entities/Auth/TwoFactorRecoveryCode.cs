namespace Hukaa.Domain.Entities.Auth;

public class TwoFactorRecoveryCode : BaseEntity, ISoftDeletable
{
    public string UserId { get; set; } = null!;

    public string CodeHash { get; set; } = null!;

    public bool IsUsed { get; set; } = false;
    public DateTime? UsedAt { get; set; }
    public User User { get; set; } = null!;

    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
    public string? DeletedBy { get; set; }
}