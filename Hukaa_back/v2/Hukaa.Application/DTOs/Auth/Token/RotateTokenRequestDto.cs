namespace Hukaa.Application.DTOs.Auth.Token;

public class RotateTokenRequestDto
{
    public string RefreshToken { get; set; } = null!;
}