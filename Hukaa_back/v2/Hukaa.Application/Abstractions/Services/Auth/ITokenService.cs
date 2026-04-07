namespace Hukaa.Application.Abstractions.Services.Auth;

public interface ITokenService
{
    Task<RefreshTokenResponse> GenerateRefreshTokenAsync(string userId);
    public AccessTokenResponse GenerateAccessToken(string userId, IList<string> roles);
}