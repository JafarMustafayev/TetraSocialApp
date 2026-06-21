namespace Tetra.API.Controllers;

[ApiController]
[Route("api/auth/[controller]")]
public class PasswordController(
    IPasswordManagementService passwordManagementService) : ControllerBase
{
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto request)
    {
        var result = await passwordManagementService.ForgotPasswordAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto request)
    {
        var result = await passwordManagementService.ResetPasswordAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDto request)
    {
        var result = await passwordManagementService.ChangePasswordAsync(request);
        return StatusCode(result.StatusCode, result);
    }

}