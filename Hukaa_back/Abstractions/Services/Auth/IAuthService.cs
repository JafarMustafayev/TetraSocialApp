namespace Hukaa_back.Abstractions.Services.Auth;

public interface IAuthService
{
    public Task<JwtTokenResponse> LoginAsync(LoginRequestDto request);
    public Task LogoutAsync();
    public Task<JwtTokenResponse> RefreshTokenAsync(string refreshToken);
}
