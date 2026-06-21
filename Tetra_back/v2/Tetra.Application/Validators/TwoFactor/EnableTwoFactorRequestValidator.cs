using Tetra.Application.Abstractions.Common;
using Tetra.Application.DTOs.Auth.TwoFactor;
using Tetra.Application.Options.Validation;

namespace Tetra.Application.Validators.TwoFactor;

public class EnableTwoFactorRequestValidator : AbstractValidator<EnableTwoFactorRequestDto>
{
    public EnableTwoFactorRequestValidator(
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
    }
}