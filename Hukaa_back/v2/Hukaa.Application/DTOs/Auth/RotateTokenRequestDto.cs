namespace Hukaa.Application.DTOs.Auth;

public class RotateTokenRequestDto
{
    public string RefreshToken { get; set; } = null!;
}