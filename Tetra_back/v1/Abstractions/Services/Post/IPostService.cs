namespace Hukaa_back.Abstractions.Services.Post;

public interface IPostService
{
    Task<ResponseDto> GetMyPostsAsync(int page, int take);
    Task<ResponseDto> GetMyFeedsAsync(int page, int take);
    Task<ResponseDto> GetUserPostsAsync(string userId, int page, int take);
    Task<ResponseDto> GetMyArchivedPostsAsync(int page, int take);
    Task<ResponseDto> GetReactedPostsAsync(int page, int take);
    Task<ResponseDto> GetSavedPostsAsync(int page, int take);
    Task<ResponseDto> CreateAsync(PostCreateRequestDto request);
    Task<ResponseDto> UpdateContentAsync(string postId, PostUpdateRequestDto request);
    Task<ResponseDto> DeleteAsync(string postId);
    Task<ResponseDto> ToggleArchiveAsync(string postId, TogglePostArchiveStatusDto request);
    Task<ResponseDto> ToggleSavedAsync(string postId);
    Task<ResponseDto> GetByIdAsync(string postId);
}