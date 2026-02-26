namespace Hukaa_back.Abstractions.Services.Post;

public interface IReactionService
{
    int GetReactionCount(string postId);
    Task<ReactionType?> GetMyReaction(string postId);
    Task<Dictionary<string, int>> GetReactionCountsAsync(List<string> postIds);
    Task<Dictionary<string, ReactionType?>> GetMyReactionsAsync(List<string> postIds);
    Task<ResponseDto> ToggleReactionAsync(TogglePostReactionDto request, string postId);
}