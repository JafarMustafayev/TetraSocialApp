namespace Hukaa_back.Validators.Auth;

public class ForgotPasswordRequestDtoValidator : AbstractValidator<ForgotPasswordRequestDto>
{
    public ForgotPasswordRequestDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotNull().WithMessage("Email cannot be null.")
            .NotEmpty().WithMessage("Email cannot be empty.")
            .EmailAddress().WithMessage("Please provide a valid email address.");
    }
}