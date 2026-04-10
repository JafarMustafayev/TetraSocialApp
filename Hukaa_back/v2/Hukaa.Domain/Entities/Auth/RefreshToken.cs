namespace Hukaa.Domain.Entities.Auth;

public class RefreshToken : BaseEntity
{
    public string TokenHash { get; set; } = null!;

    public DateTime ExpiresAt { get; set; }

    public string CreatedByIp { get; set; } = null!;

    public bool IsUsed { get; private set; }
    public DateTime? UsedAt { get; private set; }

    public string? ReplacedByTokenId { get; private set; }
    public RefreshToken? ReplacedByToken { get; set; }
    public string? ReplacedByIp { get; private set; }

    public bool IsRevoked { get; private set; }
    public DateTime? RevokedAt { get; private set; }
    public string? RevokedByIp { get; private set; }

    public string AuthSessionId { get; set; } = null!;
    public AuthSession AuthSession { get; set; } = null!;

    //  Computed
    public bool IsExpired => ExpiresAt <= DateTime.UtcNow;

    public bool IsActive => !IsRevoked && !IsExpired && !IsUsed;

    //  Behaviors
    public void Revoke(string ip)
    {
        if(IsRevoked)
        {
            return;
        }

        IsRevoked = true;
        RevokedAt = DateTime.UtcNow;
        RevokedByIp = ip;
    }

    public void MarkAsUsed(string ip, string? replacedByTokenId)
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

        ReplacedByTokenId = replacedByTokenId;
        ReplacedByIp = ip;
    }
}