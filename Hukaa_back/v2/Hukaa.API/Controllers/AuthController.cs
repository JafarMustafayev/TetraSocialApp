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
}