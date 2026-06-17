namespace Hukaa.API.Controllers;

[ApiController]
[Route("api/auth/2fa")]
public class TwoFactorAuthController(
    ITwoFactorService twoFactorService) : ControllerBase
{
    [HttpGet("status")]
    public async Task<IActionResult> GetTwoFactorStatus()
    {
        var result = await twoFactorService.GetStatusAsync();
        return StatusCode(result.StatusCode, result);
    }
}