namespace Tetra.Domain.Entities.Auth;

public class VerificationToken : BaseEntity
{
    public string TokenHash { get; set; } = null!;

    public VerificationTokenPurpose Purpose { get; set; }

    public DateTime ExpiresAt { get; set; }

    public string? Target { get; set; }

    public string CreatedByIp { get; set; } = null!;

    // User relation
    public string UserId { get; set; } = null!;
    public User User { get; set; } = null!;

    // Usage
    public bool IsUsed { get; private set; }
    public DateTime? UsedAt { get; private set; }
    public string? UsedByIp { get; private set; }

    // Revocation
    public bool IsRevoked { get; private set; }
    public DateTime? RevokedAt { get; private set; }
    public string? RevokedByIp { get; private set; }
    public VerificationTokenRevocationReason? RevocationReason { get; private set; }

    // Replacement (for resend flow)
    public string? ReplacedByTokenId { get; private set; }
    public VerificationToken? ReplacedByToken { get; set; }

    // Computed
    public bool IsExpired => ExpiresAt <= DateTime.UtcNow;

    public bool IsActive => !IsUsed && !IsRevoked && !IsExpired;

    // Behaviors

    public void MarkAsUsed(string ip)
    {
        if(IsUsed)
        {
            throw new InvalidOperationException("Token already used");
        }

        if(IsRevoked)
        {
            throw new InvalidOperationException("Token is revoked");
        }

        if(IsExpired)
        {
            throw new InvalidOperationException("Token is expired");
        }

        IsUsed = true;
        UsedAt = DateTime.UtcNow;
        UsedByIp = ip;
    }

    public void Revoke(string ip, VerificationTokenRevocationReason reason)
    {
        if(IsRevoked)
        {
            return;
        }

        IsRevoked = true;
        RevokedAt = DateTime.UtcNow;
        RevokedByIp = ip;
        RevocationReason = reason;
    }

    public void Supersede(string ip, VerificationTokenRevocationReason reason, string newTokenId)
    {
        if(IsUsed)
        {
            throw new InvalidOperationException("Token already used");
        }

        if(IsRevoked)
        {
            throw new InvalidOperationException("Token is revoked");
        }

        if(IsExpired)
        {
            throw new InvalidOperationException("Token is expired");
        }

        IsRevoked = true;
        RevokedAt = DateTime.UtcNow;
        RevokedByIp = ip;
        RevocationReason = reason;

        ReplacedByTokenId = newTokenId;
    }
}