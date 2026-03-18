namespace Hukaa_back.Abstractions.Services.Auth;

public interface IAccountManagementService
{
    Task<ResponseDto> CheckPassword(CheckPasswordRequestDto request);
    Task<ResponseDto> ChangePasswordAsync(ChangePasswordDto request);
    Task<ResponseDto> ChangeUsernameAsync(ChangeUsernameDto request);
}