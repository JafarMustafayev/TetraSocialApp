namespace Hukaa.Domain.Entities.Auth;

public class AuthSession : BaseEntity
{
    public string UserId { get; set; } = null!;

    public string? UserAgent { get; set; }
    public string? DeviceInfo { get; set; }
    public string? LocationInfo { get; set; }

    public string CreatedByIp { get; set; } = null!;

    public DateTime? LastActivityAt { get; set; } = DateTime.UtcNow;

    public bool IsRevoked { get; set; }
    public DateTime? RevokedAt { get; set; }
    public string? RevokedByIp { get; set; }

    public virtual User User { get; set; } = null!;
    public virtual HashSet<RefreshToken> RefreshTokens { get; set; } = new();

    public void Revoke(string revokedByIp)
    {
        if(IsRevoked)
        {
            return;
        }

        IsRevoked = true;
        RevokedAt = DateTime.UtcNow;
        RevokedByIp = revokedByIp;
    }
}