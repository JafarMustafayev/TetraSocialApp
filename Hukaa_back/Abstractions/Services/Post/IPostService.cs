namespace Hukaa_back.Abstractions.Services.Post;

public interface IPostService
{
    Task<ResponseDto> GetMyPosts(int page, int take);
    Task<ResponseDto> GetUserPostsAsync(string userId,int page, int take);
    Task<ResponseDto> GetMyArchivedPosts(int page, int take);
    Task<ResponseDto> CreateAsync( PostCreateRequestDto request);
    Task<ResponseDto> UpdateContentAsync( string postId, PostUpdateRequestDto request);
    Task<ResponseDto> DeleteAsync(string postId);
    Task<ResponseDto> ToggleArchiveAsync(string postId,TogglePostArchiveStatusDto  request );
    Task<ResponseDto> GetByIdAsync(string postId);
}
