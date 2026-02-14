namespace Hukaa_back.DTOs.Auth;

public sealed class JwtTokenResponse
{
    public AccessTokenResponse AccessToken { get; set; } = new();
    public RefreshTokenResponse RefreshToken { get; set; } = new();
}

public class AccessTokenResponse
{
    public string TokenType { get; set; } = "Bearer";
    public string AccessToken { get; set; } = string.Empty;
    public DateTime AccessTokenExpiresAt { get; set; }
}

public class RefreshTokenResponse
{
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime RefreshTokenExpiresAt { get; set; }
}