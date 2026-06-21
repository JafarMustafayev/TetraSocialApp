namespace Hukaa_back.Controller;

[ApiController]
[Authorize(Roles =UserRoles.Admin)]
[Route("api/[controller]")]
public class AdminController(
    IAdminStatsService statsService,
    IAdminPostService postService,
    IAdminUserService userService):ControllerBase
{
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats() 
    {
        var res = await statsService.GetStatsAsync();
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers(int page, string? search)
    {
        var res = await userService.GetUsersAsync(page, search);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPut("users/{userId}/ban")]
    public async Task<IActionResult> BanUser(string userId)
    {
        var res = await userService.BanUserAsync(userId);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPut("users/{userId}/unban")]
    public async Task<IActionResult> UnbanUser(string userId)
    {
        var res = await userService.UnbanUserAsync(userId);
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet("posts")]
    public async Task<IActionResult> GetPosts(int page, string? search) 
    {
        var res = await postService.GetPostsAsync(page, search);
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet("users/{userId}/posts")]
    public async Task<IActionResult> GetUserPosts(string userId)
    {
        var res = await postService.GetUserPostsAsync(userId);
        return StatusCode(res.StatusCode, res);
    }

    [HttpDelete("posts/{postId}")]
    public async Task<IActionResult> DeletePost(string postId)
    {
        var res = await postService.DeletePostAsync(postId);
        return StatusCode(res.StatusCode, res);
    }
}
