
namespace Hukaa_back.Services.Dashboard;

public class AdminPostService(
    AppDbContext context,
    IMapper mapper
    ) : IAdminPostService
{
    public async Task<ResponseDto> GetPostsAsync(int page, string? search)
    {
        if (page < 1)
        {
            page = 1;
        }
        var posts = await context.Posts
            .Include(post =>post.AppUser)
            .Include(post => post.PostFiles)
            .Include(post => post.Reactions)
            .Include(post => post.Comments)
            .Where(post =>
            !post.IsArchived &&
            (string.IsNullOrEmpty(search) ||
            post.Content.Contains(search) ||
            post.AppUser.UserName.Contains(search)))
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * 10)
            .Take(10)
            .ToListAsync();

        var mappedPosts = mapper.Map<List<AdminPostListItemDto>>(posts);

        return new ResponseDto
        {
            Success = true,
            StatusCode = 200,
            Message = "Posts retrieved successfully",
            Data = mappedPosts
        };
    }

    public async Task<ResponseDto> GetUserPostsAsync(string userId)
    {
        var posts = await context.Posts
            .Where(post =>
            !post.IsArchived &&
            post.AppUserId == userId)
            .Include(post => post.AppUser)
            .Include(post => post.PostFiles)
            .Include(post => post.Reactions)
            .Include(post => post.Comments)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        var mappedPosts = mapper.Map<List<AdminPostListItemDto>>(posts);
        return new ResponseDto
        {
            Success = true,
            StatusCode = 200,
            Message = "User posts retrieved successfully",
            Data = mappedPosts
        };

        throw new NotImplementedException();
    }

    public async Task<ResponseDto> DeletePostAsync(string postId)
    {
        var post = await context.Posts
            .FirstOrDefaultAsync(post =>
            !post.IsArchived &&
            post.Id == postId);

        if (post == null)
        {
            throw new NotFoundException("Post", postId);
        }
        post.IsDeleted = true;
        post.DeleteAt = DateTime.UtcNow;
        await context.SaveChangesAsync();

        return new ResponseDto
        {
            Success = true,
            StatusCode = 200,
            Message = "Post deleted successfully"
        };
    }
}
