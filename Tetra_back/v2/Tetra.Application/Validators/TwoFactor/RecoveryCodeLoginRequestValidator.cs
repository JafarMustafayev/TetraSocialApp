using Tetra.Application.Abstractions.Common;
using Tetra.Application.DTOs.Auth.TwoFactor;
using Tetra.Application.Options.Validation;

namespace Tetra.Application.Validators.TwoFactor;

public class RecoveryCodeLoginRequestValidator : AbstractValidator<RecoveryCodeLoginRequestDto>
{
    public RecoveryCodeLoginRequestValidator(
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

        RuleFor(x => x.RecoveryCode)
            .Cascade(CascadeMode.Stop)
            .ApplyStringValidation(
                rules.RecoveryCode,
                localizer,
                "RecoveryCode");
    }
}