namespace Tetra.API.Controllers;

[ApiController]
[Route("api/auth/[controller]")]
public class EmailVerificationController(
    IEmailVerificationService emailVerificationService) : ControllerBase
{
    [HttpPost("confirm")]
    public async Task<IActionResult> ConfirmationEmail([FromBody] ConfirmEmailRequestDto request)
    {
        var res = await emailVerificationService.ConfirmAsync(request);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPost("resend")]
    public async Task<IActionResult> ConfirmationEmail([FromBody] ResendEmailConfirmationRequestDto request)
    {
        var res = await emailVerificationService.ResendConfirmationAsync(request);
        return StatusCode(res.StatusCode, res);
    }

}