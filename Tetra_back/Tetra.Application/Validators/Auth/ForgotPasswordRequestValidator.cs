using Tetra.Application.Abstractions.Common;
using Tetra.Application.DTOs.Auth.Password;
using Tetra.Application.Options.Validation;

namespace Tetra.Application.Validators.Auth;

public class ForgotPasswordRequestValidator : AbstractValidator<ForgotPasswordRequestDto>
{
    public ForgotPasswordRequestValidator(
        IAppConfig appConfig,
        ILocalizationService localizer)
    {
        var rules = appConfig.GetSection<ValidationOptions>().Auth.Register;

        RuleFor(x => x.Email)
            .Cascade(CascadeMode.Stop)
            .ApplyStringValidation(
                rules.Email,
                localizer,
                "Email")
            .EmailAddress()
            .WithMessage(localizer.Get("Validation.Common.Validation.InvalidEmail"));
    }
}