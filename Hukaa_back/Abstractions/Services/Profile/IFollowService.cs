namespace Hukaa_back.Abstractions.Services.Profile;

public interface IFollowService
{
    Task<ResponseDto> FollowAsync(string followingId);
    Task<ResponseDto> UnfollowAsync(string followingId);
    Task<ResponseDto> PendingFollowRequestsAsync();
    Task<ResponseDto> AcceptFollowRequestAsync(string requesterId);
    Task<ResponseDto> RejectFollowRequestAsync(string requesterId);
    Task<ResponseDto> GetMyFollowersAsync();
    Task<ResponseDto> GetFollowingsAsync();
    Task<ResponseDto> GetFollowingUsersAsync(string userId);
    Task<ResponseDto> GetFollowerUsersAsync(string userId);
}
