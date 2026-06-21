namespace Tetra.Application.DTOs.Auth.TwoFactor;

public sealed class VerifyAuthenticatorSetupRequestDto
{
    public string Code { get; set; } = null!;
}