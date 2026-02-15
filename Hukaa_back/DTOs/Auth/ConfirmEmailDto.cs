namespace Hukaa_back.DTOs.Auth;

public class ConfirmEmailDto
{
    public string Id { get; init; }
    public string Email { get; init; }
    public string Token { get; init; }

    public ConfirmEmailDto()
    {
        Id = string.Empty;
        Token = string.Empty;
        Email = string.Empty;
    }
}