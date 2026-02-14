namespace Hukaa_back.DTOs.Auth;

public record LoginRequestDto
{
    public string UsernameOrEmail { get; init; }
    public string Password { get; init; }

    public LoginRequestDto()
    {
        UsernameOrEmail = string.Empty;
        Password = string.Empty;
    }
}