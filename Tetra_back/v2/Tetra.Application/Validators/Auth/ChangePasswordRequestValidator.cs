using Tetra.Application.Abstractions.Common;
using Tetra.Application.DTOs.Auth.Password;
using Tetra.Application.Options.Validation;

namespace Tetra.Application.Validators.Auth;

public class ChangePasswordRequestValidator : AbstractValidator<ChangePasswordRequestDto>
{
    public ChangePasswordRequestValidator(
        IAppConfig appConfig,
        ILocalizationService localizer)
    {
        var rules = appConfig.GetSection<ValidationOptions>().Auth.Login;

        RuleFor(x => x.CurrentPassword)
            .Cascade(CascadeMode.Stop)
            .ApplyStringValidation(
                rules.Password,
                localizer,
                "CurrentPassword");

        RuleFor(x => x.NewPassword)
            .Cascade(CascadeMode.Stop)
            .ApplyStringValidation(
                rules.Password,
                localizer,
                "NewPassword");
    }

}