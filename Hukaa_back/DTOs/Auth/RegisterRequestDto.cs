namespace Hukaa_back.DTOs.Auth;

public record RegisterRequestDto
{
    public string Username { get; init; }
    public string Email { get; init; }
    public string Password { get; init; }

    public RegisterRequestDto()
    {
        Username = string.Empty;
        Email = string.Empty;
        Password = string.Empty;
    }
}