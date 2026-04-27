namespace Hukaa.Application.DTOs.Auth.Password;

public class ChangePasswordRequestDto
{
    public string CurrentPassword { get; set; } = null!;
    public string NewPassword { get; set; } = null!;
}