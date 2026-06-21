using Tetra.Application.DTOs.Auth.Password;
using Tetra.Application.DTOs.Wrappers;

namespace Tetra.Application.Abstractions.Services.Account;

public interface IPasswordManagementService
{
    Task<ResponseDto<object>> ForgotPasswordAsync(ForgotPasswordRequestDto request);
    Task<ResponseDto> ResetPasswordAsync(ResetPasswordRequestDto request);
    Task<ResponseDto> ChangePasswordAsync(ChangePasswordRequestDto request);
}