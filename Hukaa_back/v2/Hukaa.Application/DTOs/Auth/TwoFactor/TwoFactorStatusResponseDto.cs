namespace Hukaa.Application.DTOs.Auth.TwoFactor;

public sealed class TwoFactorStatusResponseDto
{
    public bool IsEmailTwoFactorEnabled { get; set; }
    public bool IsAuthenticatorEnabled { get; set; }
    public bool HasRecoveryCodes { get; set; }
}