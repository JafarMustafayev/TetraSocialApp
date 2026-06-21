namespace Tetra.Application.Abstractions.Services.Auth;

public interface IAuthTokenService
{
    AccessTokenResponse GenerateAccessToken(string userId, string sessionId, IList<string> roles);
    Task<RefreshTokenResponse> GenerateRefreshTokenAsync(string sessionId);
    Task<RefreshToken> ValidateRefreshTokenAsync(string refreshToken);
    Task RevokeRefreshTokenAsync(string refreshToken);
    Task RevokeRefreshTokenBySessionIdAsync(string sessionId);
    Task<AuthTokenResponse> RotateValidatedRefreshTokenAsync(string oldPlainToken, string userId, List<string> roles);
}