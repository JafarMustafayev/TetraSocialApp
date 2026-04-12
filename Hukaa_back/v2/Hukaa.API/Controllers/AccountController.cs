namespace Hukaa.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController(
    IAccountService accountService) : ControllerBase
{
    [HttpGet("check-email")]
    public async Task<IActionResult> CheckEmail([FromQuery] string email)
    {
        var res = await accountService.CheckEmailAvailabilityAsync(email);
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet("check-username")]
    public async Task<IActionResult> CheckUsername([FromQuery] string username)
    {
        var res = await accountService.CheckUsernameAvailabilityAsync(username);
        return StatusCode(res.StatusCode, res);
    }
}