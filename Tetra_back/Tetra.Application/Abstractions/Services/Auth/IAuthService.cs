namespace Tetra.Application.Abstractions.Services.Auth;

public interface IAuthService
{
    Task<ResponseDto> RegisterAsync(RegisterRequestDto request);
    Task<ResponseDto<LoginResponseDto>> LoginAsync(LoginRequestDto request);
    Task<ResponseDto<AuthTokenResponse>> RefreshTokenAsync(RotateTokenRequestDto request);
    Task<ResponseDto> LogoutAsync();
    Task<ResponseDto<AuthTokenResponse>> LoginWithTwoFactorAsync(VerifyTwoFactorLoginRequestDto request);
    Task<ResponseDto<AuthTokenResponse>> LoginWithRecoveryCodeAsync(RecoveryCodeLoginRequestDto request);
}