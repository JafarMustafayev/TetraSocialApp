namespace Hukaa_back.Abstractions.Services.Auth;

public interface ITokenService
{
    public AccessTokenResponse GenerateAccessToken(string userId);
}
