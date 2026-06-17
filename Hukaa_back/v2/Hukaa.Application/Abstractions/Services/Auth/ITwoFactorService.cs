namespace Hukaa.Application.Abstractions.Services.Auth;

public interface ITwoFactorService
{
    Task<ResponseDto<TwoFactorStatusResponseDto>> GetStatusAsync();

    Task<ResponseDto<AuthenticatorSetupResponseDto>> SetupAuthenticatorAsync(EnableTwoFactorRequestDto request);
    Task<ResponseDto<RecoveryCodesResponseDto>> VerifyAndEnableAuthenticatorAsync(VerifyAuthenticatorSetupRequestDto request);
    Task<ResponseDto> DisableAuthenticatorAsync(DisableTwoFactorRequestDto request);
    Task<ResponseDto<RecoveryCodesResponseDto>> GenerateRecoveryCodesAsync(EnableTwoFactorRequestDto request);

}