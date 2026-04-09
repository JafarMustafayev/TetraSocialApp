namespace Hukaa.Application.Abstractions.Services.Auth;

public interface ITokenService
{
    Task<RefreshTokenResponse> GenerateRefreshTokenAsync(string sessionId);

    public AccessTokenResponse GenerateAccessToken(
        string userId,
        string sessionId,
        IList<string> roles);
}