namespace Hukaa.Application.DTOs.Auth.TwoFactor;

public sealed class VerifyTwoFactorLoginRequestDto
{
    public string ChallengeId { get; set; } = null!;
    public int Code { get; set; }
}