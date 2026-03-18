namespace Hukaa_back.Services.Auth;

public class AccountRecoveryService(
    UserManager<AppUser> userManager,
    IAppConfig config,
    IEmailSenderService emailSenderService) : IAccountRecoveryService
{
    private readonly ApplicationUrlParameters _urlParameters = config.GetSection<ApplicationUrlParameters>();

    public async Task<ResponseDto> ForgotPasswordAsync(ForgotPasswordRequestDto request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if(user == null)
        {
            throw new NotFoundException("User", request.Email);
        }

        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        var url =
            $"{_urlParameters.FrontEndApplicationUrl}{_urlParameters.ForgotPasswordUrl}"
            + $"?token={WebUtility.UrlEncode(token)}"
            + $"&email={WebUtility.UrlEncode(user.Email)}";

        await emailSenderService.SendForgotPasswordAsync(user.Email, url);

        return new ResponseDto
        {
            Success = true,
            Message = "Password reset link sent to your email",
            StatusCode = StatusCodes.Status200OK
        };
    }

    public async Task<ResponseDto> ResetPasswordAsync(ResetPasswordRequestDto request)
    {
        var email = WebUtility.UrlDecode(request.Email);
        var user = await userManager.FindByEmailAsync(email);

        if(user == null)
        {
            throw new NotFoundException("User", email);
        }

        var token = WebUtility.UrlDecode(request.Token);
        var password = WebUtility.UrlDecode(request.Password);

        var res = await userManager.ResetPasswordAsync(user, token, password);

        if(!res.Succeeded)
        {
            throw new Exceptions.ValidationException("Invalid or expired  token",
                res.Errors.Select(err => err.Description).ToList());
        }

        return new ResponseDto
        {
            Success = true,
            Message = "Password reset successfully",
            StatusCode = StatusCodes.Status200OK
        };
    }
}