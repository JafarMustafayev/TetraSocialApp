namespace Hukaa_back.Controller;

[ApiController]
[Route("/api/[controller]/[action]")]
public class AuthController(
    IAuthService authService,
    IRegistrationService registrationService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        var res = await registrationService.RegisterAsync(request);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        var res = await authService.LoginAsync(request);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPost]
    public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailDto request)
    {
        var res = await registrationService.ConfirmEmailAsync(request);
        return StatusCode(res.StatusCode, res);
    }
}