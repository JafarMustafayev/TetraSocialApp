namespace Hukaa_back.Services.Profile;

public class FollowService(
    AppDbContext context,
    ICurrentUserService currentUserService,
    IMapper mapper) : IFollowService
{
    public async Task<ResponseDto> FollowAsync(string followingId)
    {
        var follow = await context.Follows.FirstOrDefaultAsync(
            x => x.FollowingId == followingId
            && x.FollowerId == currentUserService.UserId);

        if (follow != null)
        {
            if(follow.Status == FollowStatus.Accepted)
            {
                throw new BadHttpRequestException("You are already following this user.");
            }
            else
            {
                throw new BadRequestException("A follow request to this user is already pending.");
            }
        }

        var user = await context.Users.FirstOrDefaultAsync(x => x.Id == followingId);

        if (user == null)
        {
            throw new NotFoundException("User", followingId);
        }

        await context.Follows.AddAsync(new()
        {
            FollowerId = currentUserService.UserId,
            Following = user,
            Status = user.IsPublicAccount ? FollowStatus.Accepted : FollowStatus.Pending
        });
        await context.SaveChangesAsync();

        return new()
        {
            Success = true,
            StatusCode = StatusCodes.Status200OK,
            Message = user.IsPublicAccount
            ? "User followed successfully."
            : "Follow request sent successfully.",
            Data = null
        };
    }
    public async Task<ResponseDto> UnfollowAsync(string followingId)
    {
        var follow = await context.Follows.FirstOrDefaultAsync(
            x => x.FollowingId == followingId
            && x.FollowerId == currentUserService.UserId
            && x.Status == FollowStatus.Accepted);

        if (follow == null)
        {
            throw new BadRequestException("Cannot unfollow a user you are not following.");
        }

        context.Follows.Remove(follow);
        await context.SaveChangesAsync();

        return new()
        {
            Success = true,
            StatusCode = StatusCodes.Status200OK,
            Message = "User unfollowed successfully.",
            Data = null
        };
    }
    public async Task<ResponseDto> CancelFollowRequestAsync(string followingId)
    {
        var follow = await context.Follows.FirstOrDefaultAsync(
            x => x.FollowingId == followingId
            && x.FollowerId == currentUserService.UserId
            && x.Status == FollowStatus.Pending);

        if (follow == null)
        {
            throw new BadRequestException("Pending follow request not found.");
        }

        context.Follows.Remove(follow);
        await context.SaveChangesAsync();


        return new()
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
            .Where(
                x => x.FollowingId == currentUserService.UserId
                && x.Status == FollowStatus.Pending)
            .ToListAsync();

        var map = mapper.Map<List<FollowerDto>>(follow);

        return new()
        {
            Success = true,
            StatusCode = StatusCodes.Status200OK,
            Message = "Pending follow requests retrieved successfully.",
            Data = map
        };
    }
    public async Task<ResponseDto> AcceptFollowRequestAsync(string requesterId)
    {
        var follow = await context.Follows.FirstOrDefaultAsync(
            x => x.FollowerId == requesterId
            && x.FollowingId == currentUserService.UserId
            && x.Status == FollowStatus.Pending);

        if (follow == null)
        {
            throw new BadRequestException("No pending follow request found from this user.");
        }

        follow.Status = FollowStatus.Accepted;
        await context.SaveChangesAsync();

        return new()
        {
            Success = true,
            StatusCode = StatusCodes.Status200OK,
            Message = "Follow request accepted.",
            Data = null
        };
    }
    public async Task<ResponseDto> RejectFollowRequestAsync(string requesterId)
    {
        var follow = await context.Follows.FirstOrDefaultAsync(
            x => x.FollowerId == requesterId
            && x.FollowingId == currentUserService.UserId
            && x.Status == FollowStatus.Pending);

        if (follow == null)
        {
            throw new BadRequestException("No pending follow request found from this user.");
        }

        context.Follows.Remove(follow);
        await context.SaveChangesAsync();

        return new()
        {
            Success = true,
            StatusCode = StatusCodes.Status200OK,
            Message = "Follow request rejected.",
            Data = null
        };
    }
    public async Task<ResponseDto> RemoveFollower(string userId)
    {
        var follow = await context.Follows.FirstOrDefaultAsync(
            x => x.FollowerId == userId
            && x.FollowingId == currentUserService.UserId
            && x.Status == FollowStatus.Accepted);

        if (follow == null)
        {
            throw new BadRequestException("This user is not your follower.");
        }

        context.Follows.Remove(follow);
        await context.SaveChangesAsync();

        return new()
        {
            Success = true,
            StatusCode = StatusCodes.Status200OK,
            Message = "User has been removed from your followers.",
            Data = null
        };
    }
    public async Task<ResponseDto> GetMyFollowersAsync()
    {
        var followers = await context.Follows
            .Include(x => x.Follower)
            .Where(x => x.FollowingId == currentUserService.UserId && x.Status == FollowStatus.Accepted)
            .ToListAsync();

        var map = mapper.Map<List<FollowerDto>>(followers);

        return new()
        {
            Success = true,
            StatusCode = StatusCodes.Status200OK,
            Message = "Followers retrieved successfully.",
            Data = map
        };
    }
    public async Task<ResponseDto> GetFollowingsAsync()
    {
        var following = await context.Follows
            .Include(x => x.Following)
            .Where(x => x.FollowerId == currentUserService.UserId && x.Status == FollowStatus.Accepted)
            .ToListAsync();

        var map = mapper.Map<List<FollowingDto>>(following);

        return new()
        {
            Success = true,
            StatusCode = StatusCodes.Status200OK,
            Message = "Followings retrieved successfully",
            Data = map
        };
    }
    public async Task<ResponseDto> GetFollowingUsersAsync(string userId)
    {
        var canYouRead = await context.Follows.AnyAsync(
            x => x.FollowingId == userId
            && x.FollowerId == currentUserService.UserId
            && x.Status == FollowStatus.Accepted);

        if (!canYouRead)
        {
            throw new ForbiddenException("You cannot view this user's followings because you are not following them.");
        }

        var following = await context.Follows
           .Include(x => x.Following)
           .Where(x => x.FollowerId == userId && x.Status == FollowStatus.Accepted)
           .ToListAsync();

        var map = mapper.Map<List<FollowingDto>>(following);

        return new()
        {
            Success = true,
            StatusCode = StatusCodes.Status200OK,
            Message = "User's followings retrieved successfully",
            Data = map
        };
    }
    public async Task<ResponseDto> GetFollowerUsersAsync(string userId)
    {
        var canYouRead = await context.Follows.AnyAsync(
            x => x.FollowingId == userId
            && x.FollowerId == currentUserService.UserId
            && x.Status == FollowStatus.Accepted);

        if (!canYouRead)
        {
            throw new ForbiddenException("You cannot view this user's followers because you are not following them.");
        }

        var followers = await context.Follows
            .Include(x => x.Follower)
            .Where(x => x.FollowingId == userId && x.Status == FollowStatus.Accepted)
            .ToListAsync();

        var map = mapper.Map<List<FollowerDto>>(followers);

        return new()
        {
            Success = true,
            StatusCode = StatusCodes.Status200OK,
            Message = "User's followers retrieved successfully.",
            Data = map
        };
    }

   
}