using Tetra.Application.DTOs.Auth.TwoFactor;
using Tetra.Application.DTOs.Wrappers;

namespace Tetra.Application.Abstractions.Services.Auth;

public interface ITwoFactorService
{
    Task<ResponseDto<TwoFactorStatusResponseDto>> GetStatusAsync();

    Task<ResponseDto<AuthenticatorSetupResponseDto>> SetupAuthenticatorAsync(EnableTwoFactorRequestDto request);
    Task<ResponseDto<RecoveryCodesResponseDto>> VerifyAndEnableAuthenticatorAsync(VerifyAuthenticatorSetupRequestDto request);
    Task<ResponseDto> DisableAuthenticatorAsync(DisableTwoFactorRequestDto request);

    Task<ResponseDto<RecoveryCodesResponseDto>> GenerateRecoveryCodesAsync(EnableTwoFactorRequestDto request);
    Task<(bool isValid, User? user)> VerifyRecoveryCodeAsync(RecoveryCodeLoginRequestDto request);

    Task<TwoFactorChallengeResponseDto> CreateLoginChallengeAsync(string userId, string provider);
    Task<(bool isValid, User? user)> VerifyLoginChallengeAsync(VerifyTwoFactorLoginRequestDto request);

}