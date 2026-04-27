namespace Hukaa.Application.Abstractions.Services.Account;

public interface IPasswordManagementService
{
    Task<ResponseDto<object>> ForgotPasswordAsync(ForgotPasswordRequestDto request);
    Task<ResponseDto> ResetPasswordAsync(ResetPasswordRequestDto request);
    Task<ResponseDto> ChangePasswordAsync(ChangePasswordRequestDto request);
}