namespace Hukaa_back.Validators.Auth;

public class RegisterRequestDtoValidator : AbstractValidator<RegisterRequestDto>
{
    public RegisterRequestDtoValidator()
    {
        RuleFor(x => x.Username)
            .NotNull().WithMessage("Username cannot be null.")
            .NotEmpty().WithMessage("Username cannot be empty.");

        RuleFor(x => x.Email)
            .NotNull().WithMessage("Email cannot be null.")
            .NotEmpty().WithMessage("Email cannot be empty.")
            .EmailAddress().WithMessage("Please provide a valid email address.");

        RuleFor(x => x.Password)
            .NotNull().WithMessage("Password cannot be null.")
            .NotEmpty().WithMessage("Password cannot be empty.")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters long.");
    }
}