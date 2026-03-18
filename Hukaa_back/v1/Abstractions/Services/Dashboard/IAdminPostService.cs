namespace Hukaa_back.Abstractions.Services.Dashboard;

public interface IAdminPostService
{
    Task<ResponseDto> GetPostsAsync(int page, string? search);

    Task<ResponseDto> GetUserPostsAsync(string userId);

    Task<ResponseDto> DeletePostAsync(string postId);
}
