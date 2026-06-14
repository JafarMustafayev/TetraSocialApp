namespace Hukaa.Application.Validators.TwoFactor;

public class VerifyAuthenticatorSetupRequestValidator : AbstractValidator<VerifyAuthenticatorSetupRequestDto>
{
    public VerifyAuthenticatorSetupRequestValidator(
        IAppConfig appConfig,
        ILocalizationService localizer)
    {
        var rules = appConfig.GetSection<ValidationOptions>().TwoFactor;

        RuleFor(x => x.Code)
            .Cascade(CascadeMode.Stop)
            .ApplyIntValidation(
                rules.Code,
                localizer,
                "Code");
    }
}