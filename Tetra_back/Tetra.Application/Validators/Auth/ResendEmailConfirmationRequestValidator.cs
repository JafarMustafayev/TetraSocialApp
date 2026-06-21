using Tetra.Application.Abstractions.Common;
using Tetra.Application.DTOs.Auth.EmailVerification;

namespace Tetra.Application.Validators.Auth;

public class ResendEmailConfirmationRequestValidator : AbstractValidator<ResendEmailConfirmationRequestDto>
{
    public ResendEmailConfirmationRequestValidator(ILocalizationService localizer)
    {
        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage(localizer.Get("Validation.Common.Validation.Required", "UserId"))
            .NotNull().WithMessage(localizer.Get("Validation.Common.Validation.Required", "UserId"));
    }
}