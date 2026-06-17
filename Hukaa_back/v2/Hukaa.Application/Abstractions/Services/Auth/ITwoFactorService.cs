namespace Hukaa.Application.Abstractions.Services.Auth;

public interface ITwoFactorService
{
    Task<ResponseDto<TwoFactorStatusResponseDto>> GetStatusAsync();

    Task<ResponseDto<AuthenticatorSetupResponseDto>> SetupAuthenticatorAsync(EnableTwoFactorRequestDto request);
    Task<ResponseDto<RecoveryCodesResponseDto>> VerifyAndEnableAuthenticatorAsync(VerifyAuthenticatorSetupRequestDto request);

}