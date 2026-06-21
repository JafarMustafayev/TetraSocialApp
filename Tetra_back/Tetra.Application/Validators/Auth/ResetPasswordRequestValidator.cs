using Tetra.Application.Abstractions.Common;
using Tetra.Application.DTOs.Auth.Password;
using Tetra.Application.Options.Validation;

namespace Tetra.Application.Validators.Auth;

public class ResetPasswordRequestValidator : AbstractValidator<ResetPasswordRequestDto>
{
    public ResetPasswordRequestValidator(
        IAppConfig appConfig,
        ILocalizationService localizer)
    {
        RuleFor(x => x.NewPassword)
            .Cascade(CascadeMode.Stop)
            .ApplyStringValidation(
                appConfig.GetSection<ValidationOptions>().Auth.Login.Password,
                localizer,
                "NewPassword");

        RuleFor(x => x.Token)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage(localizer.Get("Validation.Common.Validation.Required", "Token"))
            .NotNull().WithMessage(localizer.Get("Validation.Common.Validation.Required", "Token"));

        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage(localizer.Get("Validation.Common.Validation.Required", "UserId"))
            .NotNull().WithMessage(localizer.Get("Validation.Common.Validation.Required", "UserId"));
    }
}