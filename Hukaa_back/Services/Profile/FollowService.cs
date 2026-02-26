namespace Hukaa_back.Services.Profile;

public class FollowService(
    AppDbContext context,
    ICurrentUserService currentUserService,
    IMapper mapper) : IFollowService
{
    public async Task<ResponseDto> FollowAsync(string followingId)
    {
        var follow = await context.Follows.FirstOrDefaultAsync(x => x.FollowingId == followingId
                                                                    && x.FollowerId == currentUserService.UserId);

        if (follow != null)
        {
            if (follow.Status == FollowStatus.Accepted)
                throw new BadHttpRequestException("You are already following this user.");
            else
                throw new BadRequestException("A follow request to this user is already pending.");
        }

        var user = await context.Users.FirstOrDefaultAsync(x => x.Id == followingId);

        if (user == null) throw new NotFoundException("User", followingId);

        await context.Follows.AddAsync(new Follow
        {
            FollowerId = currentUserService.UserId,
            Following = user,
            Status = user.AccountType == AccountType.PublicAccount ? FollowStatus.Accepted : FollowStatus.Pending
        });
        await context.SaveChangesAsync();

        return new ResponseDto
        {
            Success = true,
            StatusCode = StatusCodes.Status200OK,
            Message = user.AccountType == AccountType.PublicAccount
                ? "User followed successfully."
                : "Follow request sent successfully.",
            Data = new
            {
                FollowStatus = user.AccountType == AccountType.PublicAccount
                    ? FollowStatus.Accepted
                    : FollowStatus.Pending
            }
        };
    }

    public async Task<ResponseDto> UnfollowAsync(string followingId)
    {
        var follow = await context.Follows.FirstOrDefaultAsync(x => x.FollowingId == followingId
                                                                    && x.FollowerId == currentUserService.UserId
                                                                    && x.Status == FollowStatus.Accepted);

        if (follow == null) throw new BadRequestException("Cannot unfollow a user you are not following.");

        context.Follows.Remove(follow);
        await context.SaveChangesAsync();

        return new ResponseDto
        {
            Success = true,
            StatusCode = StatusCodes.Status200OK,
            Message = "User unfollowed successfully.",
            Data = null
        };
    }

    public async Task<ResponseDto> CancelFollowRequestAsync(string followingId)
    {
        var follow = await context.Follows.FirstOrDefaultAsync(x => x.FollowingId == followingId
                                                                    && x.FollowerId == currentUserService.UserId
                                                                    && x.Status == FollowStatus.Pending);

        if (follow == null) throw new BadRequestException("Pending follow request not found.");

        context.Follows.Remove(follow);
        await context.SaveChangesAsync();


        return new ResponseDto
        {
            Success = true,
            StatusCode = StatusCodes.Status200OK,
            Message = "Your follow request has been canceled.",
            Data = null
        };
    }

    public async Task<ResponseDto> PendingFollowRequestsAsync()
    {
        var follow = await context.Follows
            .Include(x => x.Follower)
            .Where(x => x.FollowingId == currentUserService.UserId
                        && x.Status == FollowStatus.Pending)
            .ToListAsync();

        var map = mapper.Map<List<FollowerPreviewDto>>(follow);

        return new ResponseDto
        {
            Success = true,
            StatusCode = StatusCodes.Status200OK,
            Message = "Pending follow requests retrieved successfully.",
            Data = map
        };
    }

    public async Task<ResponseDto> AcceptFollowRequestAsync(string requesterId)
    {
        var follow = await context.Follows.FirstOrDefaultAsync(x => x.FollowerId == requesterId
                                                                    && x.FollowingId == currentUserService.UserId
                                                                    && x.Status == FollowStatus.Pending);

        if (follow == null) throw new BadRequestException("No pending follow request found from this user.");

        follow.Status = FollowStatus.Accepted;
        await context.SaveChangesAsync();

        return new ResponseDto
        {
            Success = true,
            StatusCode = StatusCodes.Status200OK,
            Message = "Follow request accepted.",
            Data = null
        };
    }

    public async Task<ResponseDto> RejectFollowRequestAsync(string requesterId)
    {
        var follow = await context.Follows.FirstOrDefaultAsync(x => x.FollowerId == requesterId
                                                                    && x.FollowingId == currentUserService.UserId
                                                                    && x.Status == FollowStatus.Pending);

        if (follow == null) throw new BadRequestException("No pending follow request found from this user.");

        context.Follows.Remove(follow);
        await context.SaveChangesAsync();

        return new ResponseDto
        {
            Success = true,
            StatusCode = StatusCodes.Status200OK,
            Message = "Follow request rejected.",
            Data = null
        };
    }

    public async Task<ResponseDto> RemoveFollower(string userId)
    {
        var follow = await context.Follows.FirstOrDefaultAsync(x => x.FollowerId == userId
                                                                    && x.FollowingId == currentUserService.UserId
                                                                    && x.Status == FollowStatus.Accepted);

        if (follow == null) throw new BadRequestException("This user is not your follower.");

        context.Follows.Remove(follow);
        await context.SaveChangesAsync();

        return new ResponseDto
        {
            Success = true,
            StatusCode = StatusCodes.Status200OK,
            Message = "User has been removed from your followers.",
            Data = null
        };
    }

    public async Task<ResponseDto> GetMyConnectionsAsync()
    {
        var followers = await context.Follows
            .Include(x => x.Follower)
            .Where(x => x.FollowingId == currentUserService.UserId
                        && x.Status == FollowStatus.Accepted)
            .ToListAsync();

        var following = await context.Follows
            .Include(x => x.Following)
            .Where(x => x.FollowerId == currentUserService.UserId
                        && x.Status == FollowStatus.Accepted)
            .ToListAsync();

        var followersMap = mapper.Map<List<FollowerPreviewDto>>(followers);
        var followingsMap = mapper.Map<List<FollowingPreviewDto>>(following);

        return new ResponseDto
        {
            Success = true,
            StatusCode = StatusCodes.Status200OK,
            Message = "Your connections retrieved successfully",
            Data = new
            {
                followers = followersMap,
                followings = followingsMap
            }
        };
    }

    public async Task<ResponseDto> GetUserConnectionsAsync(string userId)
    {
        var canYouRead = await context.Follows.AnyAsync(x => x.FollowingId == userId
                                                             && x.FollowerId == currentUserService.UserId
                                                             && x.Status == FollowStatus.Accepted);

        if (!canYouRead)
            throw new ForbiddenException("You cannot view this user's connections because you are not following them.");

        var following = await context.Follows
            .Include(x => x.Following)
            .Where(x => x.FollowerId == userId && x.Status == FollowStatus.Accepted)
            .ToListAsync();

        var followingsMap = mapper.Map<List<FollowingPreviewDto>>(following);

        var followers = await context.Follows
            .Include(x => x.Follower)
            .Where(x => x.FollowingId == userId && x.Status == FollowStatus.Accepted)
            .ToListAsync();

        var followersMap = mapper.Map<List<FollowerPreviewDto>>(followers);

        return new ResponseDto
        {
            Success = true,
            StatusCode = StatusCodes.Status200OK,
            Message = "User connections retrieved successfully",
            Data = new
            {
                followers = followersMap,
                followings = followingsMap
            }
        };
    }
}