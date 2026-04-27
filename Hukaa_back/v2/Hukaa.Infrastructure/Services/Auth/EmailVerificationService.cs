namespace Hukaa.Infrastructure.Services.Auth;

public class EmailVerificationService(
    ILocalizationService localizer,
    IAccountVerificationService verificationService,
    UserManager<User> userManager,
    IClientUrlService clientUrlService,
    IMailService mailService) : IEmailVerificationService
{
    public async Task<ResponseDto> ConfirmAsync(ConfirmEmailRequestDto request)
    {
        var decodedUserId = clientUrlService.DecodeFromUrl(request.UserId);
        var decodedToken = clientUrlService.DecodeFromUrl(request.Token);

        var user = await userManager.FindByIdAsync(decodedUserId);

        if(user == null)
        {
            throw new NotFoundException(localizer.Get("Error.Common.NotFoundWithParameter", "User",
                new Dictionary<string, object>
                {
                    ["Parameter"] = decodedUserId
                }
            ));
        }

        await verificationService.ConfirmEmailAsync(user, decodedToken);
        return ResponseDto.OkResponse(localizer.Get("Auth.Email.Confirmation.Success"));
    }

    public async Task<ResponseDto<object>> ResendConfirmationAsync(ResendEmailConfirmationRequestDto request)
    {
        var user = await userManager.FindByIdAsync(request.UserId);
        if(user == null)
        {
            throw new NotFoundException(localizer.Get("Error.Common.NotFoundWithParameter", "User",
                new Dictionary<string, object>
                {
                    ["Parameter"] = request.UserId
                }
            ));
        }

        var verificationResult = await verificationService.RegenerateEmailConfirmationTokenAsync(user);
        var url = clientUrlService.BuildEmailConfirmationUrl(user.Id, verificationResult.PlainToken);

        // todo: It will then be delivered in a professional format via a message queue (RabbitMQ).
        await mailService.SendConfirmationMail(user.Email, url);
        return ResponseDto<object>.OkResponse(
            localizer.Get("Auth.EmailVerification.Resend.Success"),
            new
            {
                verificationResult.ExpiresAt
            });
    }
}