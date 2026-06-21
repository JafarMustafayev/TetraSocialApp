namespace Tetra.Application.DTOs.Auth.Password;

public class ResetPasswordRequestDto
{
    public string UserId { get; set; } = null!;
    public string Token { get; set; } = null!;
    public string NewPassword { get; set; } = null!;
}