namespace Hukaa_back.Abstractions.Services.Auth;

public interface IAccountRecoveryService
{
    Task<ResponseDto> ForgotPasswordAsync(ForgotPasswordRequestDto request);
    Task<ResponseDto> ResetPasswordAsync(ResetPasswordRequestDto request);
}