namespace Hukaa_back.Services.Dashboard;

public class AdminUserService(
    AppDbContext context,
    IMapper mapper,
    ICurrentUserService currentUser): IAdminUserService
{
    public async Task<ResponseDto> GetUsersAsync(int page, string? search)
    {
        if(page < 1)
        {
            page = 1;
        }

        var users = await context.Users
            .Where(user => 
            (string.IsNullOrEmpty(search) ||
            user.UserName.Contains(search))&&
            (user.UserStatus == UserStatus.Active ||
            user.UserStatus == UserStatus.Banned) &&
            user.Id != currentUser.UserId)
            .Include(user =>
            user.Posts.Where(post=>
            !post.IsArchived))
            .Skip((page - 1) * 10)
            .Take(10)
            .ToListAsync();

        var mappedUsers = mapper.Map<List<AdminUsersListItemDto>>(users);

       return new()
       {
           Success = true,
            StatusCode = 200,
            Message = "Users retrieved successfully",
            Data = mappedUsers
       };
    }

    public async Task<ResponseDto> BanUserAsync(string userId)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            throw new NotFoundException("User",userId);
        }

        user.UserStatus = UserStatus.Banned;
        await context.SaveChangesAsync();
        return new()
        {
            Success = true,
            StatusCode = 200,
            Message = "User banned successfully"
        };
    }

    public async Task<ResponseDto> UnbanUserAsync(string userId)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            throw new NotFoundException("User", userId);
        }

        user.UserStatus = UserStatus.Active;
        await context.SaveChangesAsync();
        return new()
        {
            Success = true,
            StatusCode = 200,
            Message = "User unbanned successfully"
        };
    }
}
