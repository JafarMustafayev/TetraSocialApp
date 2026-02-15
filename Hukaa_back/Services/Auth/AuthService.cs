namespace Hukaa_back.Services.Auth;

public class AuthService:IAuthService
{
    public Task<JwtTokenResponse> LoginAsync(LoginRequestDto request)
    {
        throw new NotImplementedException();
    }

    public Task LogoutAsync()
    {
        throw new NotImplementedException();
    }

    public Task<JwtTokenResponse> RefreshTokenAsync(string refreshToken)
    {
        throw new NotImplementedException();
    }
}
