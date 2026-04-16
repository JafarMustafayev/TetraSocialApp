namespace Hukaa.Application.Abstractions.Services.Auth;

public interface IAuthService
{
    Task<ResponseDto> RegisterAsync(RegisterRequestDto request);
    Task<AuthTokenResponse> LoginAsync(LoginRequestDto request);
    Task<AuthTokenResponse> RefreshTokenAsync(RotateTokenRequestDto request);
    Task<ResponseDto> LogoutAsync();

    //Task<AuthTokenResponse> LoginWithTwoFactorAsync(TwoFactorVerifyRequest request);
}