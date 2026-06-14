namespace Hukaa.Application.DTOs.Auth.TwoFactor;

public class DisableTwoFactorRequestDto
{
    public string Password { get; set; } = null!;
    public int Code { get; set; }
}