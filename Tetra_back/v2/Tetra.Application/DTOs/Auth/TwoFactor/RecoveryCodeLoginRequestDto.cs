namespace Tetra.Application.DTOs.Auth.TwoFactor;

public sealed class RecoveryCodeLoginRequestDto
{
    public string ChallengeId { get; set; } = null!;
    public string RecoveryCode { get; set; } = null!;
}