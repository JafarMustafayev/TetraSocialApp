namespace Hukaa.Domain.Entities.Auth;

public class RefreshToken : BaseEntity
{
    public string TokenHash { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public bool IsUsed { get; set; } = false;
    public DateTime? RevokedAt { get; set; }
    public string? ReplacedByTokenId { get; set; }

    public string CreatedByIp { get; set; } = string.Empty;
    public string? RevokedByIp { get; set; }

    public string UserId { get; set; } = string.Empty;
    public User User { get; set; }
    public RefreshToken? ReplacedByToken { get; set; }

    public void Revoke(string ip, string? replacedByTokenId = null)
    {
        if(IsUsed)
        {
            return;
        }

        IsUsed = true;
        RevokedAt = DateTime.UtcNow;
        RevokedByIp = ip;
        ReplacedByTokenId = replacedByTokenId;
    }
}