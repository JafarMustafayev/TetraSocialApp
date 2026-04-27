namespace Hukaa.Application.DTOs.Auth.EmailVerification;

public class ConfirmEmailRequestDto
{
    public string UserId { get; set; } = null!;
    public string Token { get; init; } = null!;
}