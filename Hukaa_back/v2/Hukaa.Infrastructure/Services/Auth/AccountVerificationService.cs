namespace Hukaa.Infrastructure.Services.Auth;

public class AccountVerificationService(
    UserManager<User> userManager,
    ILocalizationService localizer,
    IVerificationTokenService verificationTokenService) : IAccountVerificationService
{
    public async Task<VerificationTokenResultDto> GenerateEmailConfirmationTokenAsync(User user)
    {
        var res = await verificationTokenService.GenerateTokenAsync(user.Id,
            VerificationTokenPurpose.EmailConfirmation,
            user.Email);

        return new VerificationTokenResultDto
        {
            PlainToken = res.plainToken,
            ExpiresAt = res.entity.ExpiresAt.Date.ToShortTimeString()
        };
    }

    public async Task<VerificationTokenResultDto> RegenerateEmailConfirmationTokenAsync(User user)
    {
        var res = await verificationTokenService.SupersedeTokenAsync(
            user.Id,
            VerificationTokenPurpose.EmailConfirmation,
            user.Email);

        return new VerificationTokenResultDto
        {
            PlainToken = res.plainToken,
            ExpiresAt = res.entity.ExpiresAt.Date.ToShortTimeString()
        };
    }

    public async Task ConfirmEmailAsync(User user, string token)
    {
        var verificationToken = await verificationTokenService.ValidateTokenAsync(
            token,
            VerificationTokenPurpose.EmailConfirmation);

        if(verificationToken.UserId != user.Id)
        {
            throw new ValidationException(localizer.Get("Error.VerificationToken.Validate.InvalidOwner"));
        }

        if(verificationToken.Target != user.Email)
        {
            throw new ValidationException(localizer.Get("Error.VerificationToken.Validate.InvalidTarget"));
        }

        user.EmailConfirmed = true;

        var result = await userManager.UpdateAsync(user);

        if(!result.Succeeded)
        {
            throw new BadRequestException(localizer.Get("Auth.Email.Confirmation.Failure"));
        }

        await verificationTokenService.ConsumeTokenAsync(verificationToken);
    }

    public async Task<VerificationTokenResultDto> GeneratePasswordResetTokenAsync(User user)
    {
        var res = await verificationTokenService.GenerateTokenAsync(
            user.Id,
            VerificationTokenPurpose.PasswordReset,
            user.Email);

        return new VerificationTokenResultDto
        {
            PlainToken = res.plainToken,
            ExpiresAt = res.entity.ExpiresAt.Date.ToShortTimeString()
        };
    }

    public async Task<VerificationTokenResultDto> RegeneratePasswordResetTokenAsync(User user)
    {
        var res = await verificationTokenService.SupersedeTokenAsync(
            user.Id,
            VerificationTokenPurpose.PasswordReset,
            user.Email);

        return new VerificationTokenResultDto
        {
            PlainToken = res.plainToken,
            ExpiresAt = res.entity.ExpiresAt.Date.ToShortTimeString()
        };
    }

    public async Task ResetPasswordAsync(User user, string token, string newPassword)
    {
        var verificationToken = await verificationTokenService.ValidateTokenAsync(
            token,
            VerificationTokenPurpose.PasswordReset);

        if(verificationToken.UserId != user.Id)
        {
            throw new ValidationException(localizer.Get("Error.VerificationToken.Validate.InvalidOwner"));
        }

        if(verificationToken.Target != user.Email)
        {
            throw new ValidationException(localizer.Get("Error.VerificationToken.Validate.InvalidTarget"));
        }

        var passwordResetToken = await userManager.GeneratePasswordResetTokenAsync(user);

        var result = await userManager.ResetPasswordAsync(
            user,
            passwordResetToken,
            newPassword);

        if(!result.Succeeded)
        {
            throw new BadRequestException(localizer.Get("Auth.Password.Reset.Failure"));
        }

        await verificationTokenService.ConsumeTokenAsync(verificationToken);
    }
}