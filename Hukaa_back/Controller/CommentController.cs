namespace Hukaa_back.Controller;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class CommentController(
    ICommentService commentService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create(CommentCreateDto dto)
    {
        var res = await commentService.CreateCommentAsync(dto);
        return StatusCode(res.StatusCode, res);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var res = await commentService.DeleteCommentAsync(id);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateCommentDto dto)
    {
        var res = await commentService.UpdateCommentAsync(id,dto);
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet("post/{postId}")]
    public async Task<IActionResult> GetByPost(string postId)
    {
        var res = await commentService.GetPostCommentsAsync(postId);
        return StatusCode(res.StatusCode, res);
    }
}