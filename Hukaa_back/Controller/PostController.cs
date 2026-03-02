namespace Hukaa_back.Controller;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class PostController(
    IPostService postService) : ControllerBase
{
    [HttpGet("me/{page}")]
    public async Task<IActionResult> GetMyPosts(int page = 1)
    {
        var res = await postService.GetMyPostsAsync(page, 20);
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet("feeds/{page}")]
    public async Task<IActionResult> GetMyFeeds(int page = 1)
    {
        var res = await postService.GetMyFeedsAsync(page, 20);
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet("{postId}")]
    public async Task<IActionResult> GetById(string postId)
    {
        var res = await postService.GetByIdAsync(postId);
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet("archived/{page}")]
    public async Task<IActionResult> GetMyArchivedPosts(int page = 1)
    {
        var res = await postService.GetMyArchivedPostsAsync(page, 20);
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet("reacted/{page}")]
    public async Task<IActionResult> GetReactedPosts(int page = 1)
    {
        var res = await postService.GetReactedPostsAsync(page, 20);
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet("saved/{page}")]
    public async Task<IActionResult> GetSavedPosts(int page = 1)
    {
        var res = await postService.GetSavedPostsAsync(page, 20);
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet("{userId}/posts/{page}")]
    public async Task<IActionResult> GetUserPosts(string userId, int page = 1)
    {
        var res = await postService.GetUserPostsAsync(userId, page, 20);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPost]
    public async Task<IActionResult> CreatePost([FromForm] PostCreateRequestDto post)
    {
        var res = await postService.CreateAsync(post);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPut("{postId}")]
    public async Task<IActionResult> UpdatePost([FromBody] PostUpdateRequestDto post, string postId)
    {
        var res = await postService.UpdateContentAsync(postId, post);
        return StatusCode(res.StatusCode, res);
    }

    [HttpDelete("{postId}")]
    public async Task<IActionResult> DeletePost(string postId)
    {
        var res = await postService.DeleteAsync(postId);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPut("{postId}/archive")]
    public async Task<IActionResult> TogglePostArchiveStatus(
        [FromBody] TogglePostArchiveStatusDto request, string postId)
    {
        var res = await postService.ToggleArchiveAsync(postId, request);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPut("{postId}/save")]
    public async Task<IActionResult> ToggleSavePost(string postId)
    {
        var res = await postService.ToggleSavedAsync(postId);
        return StatusCode(res.StatusCode, res);
    }
}