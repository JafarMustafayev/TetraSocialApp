namespace Hukaa.Application.Abstractions.Services.Account;

public interface IAccountService
{
    Task<ResponseDto> GetCurrentUserAsync();
    Task<ResponseDto> CheckEmailAvailabilityAsync(string email);
    Task<ResponseDto> CheckUsernameAvailabilityAsync(string username);
    //Task<ResponseDto> ChangeEmailAsync(ChangeEmailRequest request);
    //Task<ResponseDto> ChangeUsernameAsync(ChangeUsernameRequest request);
    Task<ResponseDto<object>> ChangeUsernameAsync(ChangeUsernameRequestDto request);
    //Task<ResponseDto> DeleteMyAccountAsync(string userId);
    //Task<ResponseDto> SuspendMyAccountAsync(string userId);
}