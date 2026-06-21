namespace Tetra.API.Controllers;

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

    [Authorize]
    [HttpPost("regenerate")]
    public async Task<IActionResult> GenerateRecoveryCodes([FromBody] EnableTwoFactorRequestDto request)
    {
        var result = await twoFactorService.GenerateRecoveryCodesAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [Authorize]
    [HttpPost("disable")]
    public async Task<IActionResult> DisableAuthenticator([FromBody] DisableTwoFactorRequestDto request)
    {
        var result = await twoFactorService.DisableAuthenticatorAsync(request);
        return StatusCode(result.StatusCode, result);
    }

}