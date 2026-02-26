namespace Hukaa_back.Services.Post;

public class ReactionService(
    AppDbContext context,
    ICurrentUserService currentUserService) : IReactionService
{
    public int GetReactionCount(string postId)
    {
        var query = context.Reactions
            .AsQueryable().AsNoTracking()
            .Where(x => x.PostId == postId)
            .Select(x => x.Id);
        return query.Count();
    }

    public async Task<ReactionType?> GetMyReaction(string postId)
    {
        var userId = currentUserService.UserId;

        var reaction = await context.Reactions
            .AsQueryable().AsNoTracking()
            .FirstOrDefaultAsync(x => x.PostId == postId && x.AppUserId == userId);

        return reaction?.ReactionType;
    }

    public async Task<Dictionary<string, int>> GetReactionCountsAsync(List<string> postIds)
    {
        return await context.Reactions
            .Where(r => postIds.Contains(r.PostId))
            .GroupBy(r => r.PostId)
            .Select(g => new
            {
                PostId = g.Key,
                Count = g.Count()
            })
            .ToDictionaryAsync(x => x.PostId, x => x.Count);
    }

    public async Task<Dictionary<string, ReactionType?>> GetMyReactionsAsync(List<string> postIds)
    {
        var userId = currentUserService.UserId;

        return await context.Reactions
            .Where(r => postIds.Contains(r.PostId) && r.AppUserId == userId)
            .ToDictionaryAsync(r => r.PostId, r => (ReactionType?)r.ReactionType);
    }

    public async Task<ResponseDto> ToggleReactionAsync(TogglePostReactionDto request, string postId)
    {
        var userId = currentUserService.UserId;

        var postExists = await context.Posts
            .AnyAsync(x => x.Id == postId && !x.IsDeleted);

        if (!postExists)
            throw new NotFoundException("Post", postId);

        var existingReaction = await context.Reactions
            .FirstOrDefaultAsync(x =>
                x.PostId == postId &&
                x.AppUserId == userId);

        ReactionType? myReaction = null;

        if (existingReaction == null)
        {
            var newReaction = new Reaction
            {
                PostId = postId,
                AppUserId = userId,
                ReactionType = request.ReactionType
            };

            await context.Reactions.AddAsync(newReaction);
            myReaction = request.ReactionType;
        }
        else if (existingReaction.ReactionType == request.ReactionType)
        {
            context.Reactions.Remove(existingReaction);
        }
        else
        {
            existingReaction.ReactionType = request.ReactionType;
            myReaction = request.ReactionType;
        }

        await context.SaveChangesAsync();

        return new ResponseDto
        {
            StatusCode = StatusCodes.Status200OK,
            Success = true,
            Message = "Reaction updated",
            Data = new
            {
                MyReaction = myReaction,
                ReactionCount = GetReactionCount(postId)
            }
        };
    }
}