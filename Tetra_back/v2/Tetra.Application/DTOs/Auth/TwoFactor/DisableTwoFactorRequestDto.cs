namespace Tetra.Application.DTOs.Auth.TwoFactor;

public class DisableTwoFactorRequestDto
{
    public string Password { get; set; } = null!;
    public string Code { get; set; } = null!;
}