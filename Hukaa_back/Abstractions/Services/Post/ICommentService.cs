namespace Hukaa_back.Abstractions.Services.Post;

public interface ICommentService
{
    Task<ResponseDto> CreateCommentAsync(CommentCreateDto dto);
    Task<ResponseDto> UpdateCommentAsync(string commentId, UpdateCommentDto dto);
    Task<ResponseDto> DeleteCommentAsync(string commentId);
    Task<ResponseDto> GetPostCommentsAsync(string postId);
}