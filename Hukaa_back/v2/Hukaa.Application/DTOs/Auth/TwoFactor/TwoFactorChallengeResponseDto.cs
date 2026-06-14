namespace Hukaa.Application.DTOs.Auth.TwoFactor;

public sealed class TwoFactorChallengeResponseDto
{
    public string ChallengeId { get; set; } = null!;
    public string Provider { get; set; } = null!; // Email / Authenticator
    public DateTime ExpiresAt { get; set; }
}