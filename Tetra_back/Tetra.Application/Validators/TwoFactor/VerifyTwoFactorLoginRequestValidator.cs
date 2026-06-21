namespace Tetra.Application.Validators.TwoFactor;

public class VerifyTwoFactorLoginRequestValidator : AbstractValidator<VerifyTwoFactorLoginRequestDto>
{
    public VerifyTwoFactorLoginRequestValidator(
        IAppConfig appConfig,
        ILocalizationService localizer)
    {
        var rules = appConfig.GetSection<ValidationOptions>().TwoFactor;

        RuleFor(x => x.ChallengeId)
            .Cascade(CascadeMode.Stop)
            .ApplyStringValidation(
                rules.ChallengeId,
                localizer,
                "ChallengeId");

        RuleFor(x => x.Code)
            .Cascade(CascadeMode.Stop)
            .ApplyStringValidation(
                rules.Code,
                localizer,
                "Code");
    }

}