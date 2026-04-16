namespace Hukaa.Application.Abstractions.Services.Auth;

public interface ITokenService
{
    AccessTokenResponse GenerateAccessToken(string userId, string sessionId, IList<string> roles);
    Task<RefreshTokenResponse> GenerateRefreshTokenAsync(string sessionId);
    Task<RefreshToken> ValidateRefreshTokenAsync(string refreshToken);
    Task RevokeRefreshTokenAsync(string refreshToken);
    Task RevokeRefreshTokenBySessionIdAsync(string sessionId);
    Task<AuthTokenResponse> RotateRefreshTokenAsync(string oldPlainToken, string userId, List<string> roles);
    Task RevokeAllRefreshTokens(string? currentPlainToken = null);

    //string GenerateOtpToken(int length = 6);
    //string GenerateTemporaryToken();
}