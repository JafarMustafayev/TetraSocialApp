
namespace Hukaa_back.Services.Dashboard;

public class AdminStatsService(
    AppDbContext context,
    IMapper mapper) : IAdminStatsService
{
    public async Task<ResponseDto> GetStatsAsync()
    {
        var totalActiveUsers = await GetActiveUserCountAsync();
        var totalPosts = await GetTotalPostCountAsync();
        var bannedUsers = await GetBannedUserCountAsync();
        var todayPosts = await GetTodayPostsCountAsync();

        return new ResponseDto
        {
            Success = true,
            StatusCode = 200,
            Message = "Admin stats retrieved successfully",
            Data = new AdminStastDto
            {
                ActiveUserCount = totalActiveUsers,
                TodayPostsCount = todayPosts,
                BannedUserCount = bannedUsers,
                TotalPostCount = totalPosts
            }
        };

        throw new NotImplementedException();
    }

    private async Task<int> GetActiveUserCountAsync()
    {
        var count = await context.Users
            .Where(user=>
            user.UserStatus == UserStatus.Active)
            .CountAsync();

        return count;
    }

    private async Task<int> GetTotalPostCountAsync()
    {
        var count = await context.Posts
            .Where(post=>
            !post.IsDeleted &&
            post.IsArchived == false)
            .CountAsync();

        return count;
    }

    private async Task<int> GetBannedUserCountAsync()
    {
        var count = await context.Users
            .Where(user =>
            user.UserStatus == UserStatus.Banned)
            .CountAsync();

        return count;
    }

    private async Task<int> GetTodayPostsCountAsync()
    {
        var hours = DateTime.UtcNow.Hour;

        var counts = await context.Posts
            .Where(post =>
            !post.IsDeleted &&
            !post.IsArchived && 
            post.CreatedAt>DateTime.UtcNow.AddHours(-hours) )
            .ToListAsync();

        

        return counts.Count;
    }
}
