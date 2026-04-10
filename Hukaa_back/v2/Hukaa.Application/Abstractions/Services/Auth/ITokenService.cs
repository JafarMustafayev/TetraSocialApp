namespace Hukaa.Application.Abstractions.Services.Auth;

public interface ITokenService
{
    AccessTokenResponse GenerateAccessToken(string userId, string sessionId, IList<string> roles);
    Task<RefreshTokenResponse> GenerateRefreshTokenAsync(string sessionId);
    Task<bool> ValidateRefreshTokenAsync(string refreshToken);

    //Task<AuthTokenResponse> RotateRefreshTokenAsync(string oldPlainToken);
    //Task RevokeRefreshTokenAsync(string userId, string refreshToken);
    //Task RevokeAllRefreshTokensAsync(string userId); // ★ yeni: userId üzrə tam silmə
    //string GenerateOtpToken(int length = 6);
    //string GenerateTemporaryToken();
}