namespace Hukaa_back.Controller;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ConversationController(
    IConversationService conversationService) : ControllerBase
{
    [HttpGet("{page}")]
    public async Task<IActionResult> GetConversationList(int page ,[FromQuery] int pageSize = 30)
    {
        var res = await conversationService.GetConversationListAsync(page,pageSize);
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet("{conversationId}/messages/{page}")]
    public async Task<IActionResult> GetMessagesList(string conversationId, int page, [FromQuery] int pageSize = 50)
    {
        var res = await conversationService.GetConversationMessagesAsync(conversationId, page,pageSize);
        return StatusCode(res.StatusCode, res);
    }

    [HttpDelete("{conversationId}")]
    public async Task<IActionResult> DeleteConversation(string conversationId)
    {
        var res = await conversationService.DeleteConversationAsync(conversationId);
        return StatusCode(res.StatusCode, res);
    }
}