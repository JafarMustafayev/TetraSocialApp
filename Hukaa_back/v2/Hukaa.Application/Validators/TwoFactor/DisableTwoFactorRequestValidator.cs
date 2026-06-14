namespace Hukaa.Application.Validators.TwoFactor;

public class DisableTwoFactorRequestValidator : AbstractValidator<DisableTwoFactorRequestDto>
{
    public DisableTwoFactorRequestValidator(
        IAppConfig appConfig,
        ILocalizationService localizer)
    {
        var rules = appConfig.GetSection<ValidationOptions>().TwoFactor;

        RuleFor(x => x.Password)
            .Cascade(CascadeMode.Stop)
            .ApplyStringValidation(
                rules.Password,
                localizer,
                "Password");

        RuleFor(x => x.Code)
            .Cascade(CascadeMode.Stop)
            .ApplyIntValidation(
                rules.Code,
                localizer,
                "Code");
    }
}