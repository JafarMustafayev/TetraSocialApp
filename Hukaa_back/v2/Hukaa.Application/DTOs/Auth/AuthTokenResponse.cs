namespace Hukaa.Application.DTOs.Auth;

public class AuthTokenResponse
{
    public AccessTokenResponse AccessToken { get; set; } = new();
    public RefreshTokenResponse RefreshToken { get; set; } = new();
}

public class AccessTokenResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public DateTime AccessTokenExpiresAt { get; set; }
}

public class RefreshTokenResponse
{
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime RefreshTokenExpiresAt { get; set; }
}