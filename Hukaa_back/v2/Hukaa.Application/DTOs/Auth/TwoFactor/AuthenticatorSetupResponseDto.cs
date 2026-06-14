namespace Hukaa.Application.DTOs.Auth.TwoFactor;

public sealed class AuthenticatorSetupResponseDto
{
    public string SharedKey { get; set; } = null!;
    public string QrCodeUri { get; set; } = null!;
}