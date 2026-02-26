namespace Hukaa_back.Controller;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class FollowController(
    IFollowService followService) : ControllerBase
{
    [HttpPost("{followingId}/follow")]
    public async Task<IActionResult> Follow(string followingId)
    {
        var res = await followService.FollowAsync(followingId);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPost("{followingId}/unfollow")]
    public async Task<IActionResult> Unfollow(string followingId)
    {
        var res = await followService.UnfollowAsync(followingId);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPost("{followingId}/cancel-request")]
    public async Task<IActionResult> CancelFollowRequest(string followingId)
    {
        var res = await followService.CancelFollowRequestAsync(followingId);
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet("pending-requests")]
    public async Task<IActionResult> PendingFollowRequests()
    {
        var res = await followService.PendingFollowRequestsAsync();
        return StatusCode(res.StatusCode, res);
    }

    [HttpPost("{requesterId}/accept-request")]
    public async Task<IActionResult> AcceptFollowRequest(string requesterId)
    {
        var res = await followService.AcceptFollowRequestAsync(requesterId);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPost("{requesterId}/reject-request")]
    public async Task<IActionResult> RejectFollowRequest(string requesterId)
    {
        var res = await followService.RejectFollowRequestAsync(requesterId);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPost("{userId}/remove")]
    public async Task<IActionResult> RemoveFollower(string userId)
    {
        var res = await followService.RemoveFollower(userId);
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet("my-connections")]
    public async Task<IActionResult> GetMyConnections()
    {
        var res = await followService.GetMyConnectionsAsync();
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet("{userId}/connections")]
    public async Task<IActionResult> GetUserConnections(string userId)
    {
        var res = await followService.GetUserConnectionsAsync(userId);
        return StatusCode(res.StatusCode, res);
    }
}