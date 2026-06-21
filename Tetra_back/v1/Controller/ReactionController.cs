namespace Hukaa_back.Controller;

[Route("api/posts/{postId}/reactions")]
[Authorize]
[ApiController]
public class ReactionController(
    IReactionService reactionService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> ToggleReaction(string postId, [FromBody] TogglePostReactionDto dto)
    {
        var result = await reactionService.ToggleReactionAsync(dto, postId);
        return StatusCode(result.StatusCode, result);
    }
}