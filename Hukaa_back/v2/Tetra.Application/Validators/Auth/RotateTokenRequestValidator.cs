using Tetra.Application.Abstractions.Common;
using Tetra.Application.DTOs.Auth.Token;

namespace Tetra.Application.Validators.Auth;

public class RotateTokenRequestValidator : AbstractValidator<RotateTokenRequestDto>
{
    public RotateTokenRequestValidator(
        ILocalizationService localizer)
    {
        RuleFor(x => x.RefreshToken)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage(localizer.Get("Validation.Common.Validation.Required", "RefreshToken"))
            .NotNull().WithMessage(localizer.Get("Validation.Common.Validation.Required", "RefreshToken"));
    }
}