namespace Hukaa_back.Validators.Auth;

public class ConfirmEmailDtoValidator : AbstractValidator<ConfirmEmailDto>
{
    public ConfirmEmailDtoValidator()
    {
        RuleFor(request => request.Token)
            .NotNull().WithMessage("Token is required")
            .NotEmpty().WithMessage("Token is required");

        RuleFor(request => request.Id)
            .NotNull().WithMessage("Id is required")
            .NotEmpty().WithMessage("Id is required");
        
        RuleFor(request => request.Email)
            .NotNull().WithMessage("Email is required")
            .NotEmpty().WithMessage("Email is required");
    }
}