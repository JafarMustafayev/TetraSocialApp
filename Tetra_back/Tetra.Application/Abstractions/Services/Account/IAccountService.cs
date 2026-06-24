namespace Tetra.Application.Abstractions.Services.Account;

public interface IAccountService
{
    Task<ResponseDto> GetCurrentUserAsync();
    Task<ResponseDto<object>> CheckEmailAvailabilityAsync(string email);
    Task<ResponseDto<object>> CheckUsernameAvailabilityAsync(string username);
    Task<ResponseDto<object>> ChangeEmailAsync(ChangeEmailRequestDto request);
    Task<ResponseDto<object>> ChangeUsernameAsync(ChangeUsernameRequestDto request);
    //Task<ResponseDto> DeleteMyAccountAsync(string userId);
    //Task<ResponseDto> SuspendMyAccountAsync(string userId);
}