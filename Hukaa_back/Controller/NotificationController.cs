namespace Hukaa_back.Controller;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class NotificationController(
    INotificationService notificationService) : ControllerBase
{
    [HttpGet("{page}")]
    public async Task<IActionResult> GetNotifications(int page = 1)
    {
        var res = await notificationService.GetNotificationsAsync(page);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPut("{notificationId}")]
    public async Task<IActionResult> ReadNotifications(string notificationId)
    {
        var res = await notificationService.ReadNotificationsAsync(notificationId);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPut("all")]
    public async Task<IActionResult> ReadAllNotifications()
    {
        var res = await notificationService.ReadAllNotificationsAsync();
        return StatusCode(res.StatusCode, res);
    }
}