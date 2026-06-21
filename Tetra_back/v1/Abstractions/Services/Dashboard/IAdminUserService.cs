namespace Hukaa_back.Abstractions.Services.Dashboard;

public interface IAdminUserService
{
    Task<ResponseDto> GetUsersAsync(int page, string? search);

    Task<ResponseDto> BanUserAsync(string userId);

    Task<ResponseDto> UnbanUserAsync(string userId);
}
