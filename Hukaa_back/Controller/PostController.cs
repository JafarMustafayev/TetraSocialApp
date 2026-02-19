namespace Hukaa_back.Controller;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class PostController(
    IPostService postService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreatePost([FromForm] PostCreateRequestDto post)
    {
        var res = await postService.CreateAsync(post);
        return Ok(res);
    }
    
    [HttpPut("{postId}")]
    public async Task<IActionResult> UpdatePost([FromBody] PostUpdateRequestDto post,string postId)
    {
        var res = await postService.UpdateContentAsync(postId,post);
        return StatusCode(res.StatusCode,res);
    }

    [HttpDelete("{postId}")]
    public async Task<IActionResult> DeletePost(string postId)
    {
        var res = await postService.DeleteAsync(postId);
        return StatusCode(res.StatusCode,res);
    }
    
    [HttpPut("{postId}/archive")]
    public async Task<IActionResult> UpdatePost([FromBody] TogglePostArchiveStatusDto request,string postId)
    {
        var res = await postService.ToggleArchiveAsync(postId,request);
        return StatusCode(res.StatusCode,res);
    }
}