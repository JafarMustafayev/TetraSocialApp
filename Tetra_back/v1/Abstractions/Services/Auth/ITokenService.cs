namespace Hukaa_back.Abstractions.Services.Auth;

public interface ITokenService
{
    public Task<AccessTokenResponse> GenerateAccessToken(string userId);
}