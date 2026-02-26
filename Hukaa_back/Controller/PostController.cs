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
        var res = await postService.GetMyPosts(page, 20);
        return Ok(res);
    }

    [HttpGet("feeds/{page}")]
    public async Task<IActionResult> GetMyFeeds(int page = 1)
    {
        var res = await postService.GetMyFeeds(page, 20);
        return Ok(res);
    }

    [HttpGet("archived/{page}")]
    public async Task<IActionResult> GetMyArchivedPosts(int page = 1)
    {
        var res = await postService.GetMyArchivedPosts(page, 20);
        return Ok(res);
    }

    [HttpGet("{userId}/posts/{page}")]
    public async Task<IActionResult> GetUserPosts(string userId, int page = 1)
    {
        var res = await postService.GetUserPostsAsync(userId, page, 20);
        return Ok(res);
    }

    [HttpPost]
    public async Task<IActionResult> CreatePost([FromForm] PostCreateRequestDto post)
    {
        var res = await postService.CreateAsync(post);
        return Ok(res);
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
    public async Task<IActionResult> UpdatePost([FromBody] TogglePostArchiveStatusDto request, string postId)
    {
        var res = await postService.ToggleArchiveAsync(postId, request);
        return StatusCode(res.StatusCode, res);
    }
}