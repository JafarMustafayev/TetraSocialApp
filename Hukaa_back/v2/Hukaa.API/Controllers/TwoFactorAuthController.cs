namespace Hukaa.API.Controllers;

[ApiController]
[Route("api/auth/2fa")]
public class TwoFactorAuthController(
    ITwoFactorService twoFactorService) : ControllerBase
{
    [Authorize]
    [HttpGet("status")]
    public async Task<IActionResult> GetTwoFactorStatus()
    {
        var result = await twoFactorService.GetStatusAsync();
        return StatusCode(result.StatusCode, result);
    }

    [Authorize]
    [HttpPost("setup")]
    public async Task<IActionResult> SetupAuthenticator([FromBody] EnableTwoFactorRequestDto request)
    {
        var result = await twoFactorService.SetupAuthenticatorAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [Authorize]
    [HttpPost("enable")]
    public async Task<IActionResult> VerifyAndEnableAuthenticator([FromBody] VerifyAuthenticatorSetupRequestDto request)
    {
        var result = await twoFactorService.VerifyAndEnableAuthenticatorAsync(request);
        return StatusCode(result.StatusCode, result);
    }
}