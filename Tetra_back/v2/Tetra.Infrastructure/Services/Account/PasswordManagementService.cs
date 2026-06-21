namespace Tetra.Infrastructure.Services.Account;

public class PasswordManagementService(
    UserManager<User> userManager,
    ILocalizationService localizer,
    IMailService mailService,
    IClientUrlService clientUrlService,
    IJwtClaimsReader claimsReader,
    IAccountVerificationService verificationService) : IPasswordManagementService
{
    public async Task<ResponseDto<object>> ForgotPasswordAsync(ForgotPasswordRequestDto request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);

        if(user == null)
        {
            throw new NotFoundException(localizer.Get("Error.Common.NotFoundWithParameter", "User",
                new Dictionary<string, object>
                {
                    ["Parameter"] = request.Email
                }
            ));
        }

        var verificationResult = await verificationService.GeneratePasswordResetTokenAsync(user);

        var url = clientUrlService.BuildPasswordResetUrl(user.Id, verificationResult.PlainToken);
        await mailService.SendPasswordResetMail(user.Email, url);

        return ResponseDto<object>.OkResponse(
            localizer.Get("Auth.PasswordReset.Request.Success"),
            new
            {
                verificationResult.ExpiresAt
            });
    }
    public async Task<ResponseDto> ResetPasswordAsync(ResetPasswordRequestDto request)
    {
        var decodedUserId = clientUrlService.DecodeFromUrl(request.UserId);
        var decodedToken = clientUrlService.DecodeFromUrl(request.Token);

        var user = await GetUserAsync(decodedUserId);

        await verificationService.ResetPasswordAsync(user, decodedToken, request.NewPassword);
        return ResponseDto.OkResponse(localizer.Get("Auth.Password.Reset.Success"));
    }
    public async Task<ResponseDto> ChangePasswordAsync(ChangePasswordRequestDto request)
    {
        var user = await GetUserAsync();
        var res = await userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);

        if(!res.Succeeded)
        {
            throw new BadRequestException(localizer.Get("Auth.Password.Change.Failure"),
                res.Errors.Select(x => x.Description).ToList());
        }

        return ResponseDto.OkResponse(localizer.Get("Auth.Password.Change.Success"));
    }

    private async Task<User> GetUserAsync(string? userId = null)
    {
        var user = await userManager.FindByIdAsync(userId ?? claimsReader.GetUserId());
        if(user == null)
        {
            throw new NotFoundException(localizer.Get("Error.Common.NotFoundWithParameter", "User",
                new Dictionary<string, object>
                {
                    ["Parameter"] = userId ?? claimsReader.GetUserId()
                }
            ));
        }

        return user;
    }
}