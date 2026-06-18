namespace Hukaa.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        var res = await authService.RegisterAsync(request);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        var res = await authService.LoginAsync(request);
        return Ok(res);
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] RotateTokenRequestDto request)
    {
        var res = await authService.RefreshTokenAsync(request);
        return Ok(res);
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var res = await authService.LogoutAsync();
        return StatusCode(res.StatusCode, res);
    }

    [HttpPost("login/2fa")]
    public async Task<IActionResult> LoginWithTwoFactor([FromBody] VerifyTwoFactorLoginRequestDto request)
    {
        var res = await authService.LoginWithTwoFactorAsync(request);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPost("login/recovery")]
    public async Task<IActionResult> LoginWithRecoveryCode([FromBody] RecoveryCodeLoginRequestDto request)
    {
        var res = await authService.LoginWithRecoveryCodeAsync(request);
        return StatusCode(res.StatusCode, res);
    }

}