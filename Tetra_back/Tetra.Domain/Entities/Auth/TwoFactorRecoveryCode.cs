using Tetra.Domain.Entities.Common;
using Tetra.Domain.Entities.Identities;

namespace Tetra.Domain.Entities.Auth;

public class TwoFactorRecoveryCode : BaseEntity
{
    public string UserId { get; set; } = null!;

    public string CodeHash { get; set; } = null!;

    public bool IsUsed { get; set; } = false;
    public DateTime? UsedAt { get; set; }
    public User User { get; set; } = null!;

    public bool IsRevoked { get; set; }
    public DateTime? RevokedAt { get; set; }

    public void Revoke()
    {
        if(IsRevoked)
        {
            return;
        }

        IsRevoked = true;
        RevokedAt = DateTime.UtcNow;
    }

    public void Use()
    {
        if(IsUsed)
        {
            return;
        }

        IsUsed = true;
        UsedAt = DateTime.UtcNow;
    }
}