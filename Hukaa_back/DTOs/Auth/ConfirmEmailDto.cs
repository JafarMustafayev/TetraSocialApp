namespace Hukaa_back.DTOs.Auth;

public class ConfirmEmailDto
{
    public string Token { get; init; }
    public string Id { get; init; }
    public string Email { get; init; }

    public ConfirmEmailDto()
    {
        Id = string.Empty;
        Token = string.Empty;
        Email = string.Empty;
    }
}
