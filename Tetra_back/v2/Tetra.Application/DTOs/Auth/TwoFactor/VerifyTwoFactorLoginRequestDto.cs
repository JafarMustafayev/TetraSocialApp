namespace Tetra.Application.DTOs.Auth.TwoFactor;

public sealed class VerifyTwoFactorLoginRequestDto
{
    public string ChallengeId { get; set; } = null!;
    public string Code { get; set; } = null!;
}