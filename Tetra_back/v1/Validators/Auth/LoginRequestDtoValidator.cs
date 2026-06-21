namespace Hukaa_back.Validators.Auth;

public class LoginRequestDtoValidator : AbstractValidator<LoginRequestDto>
{
    public LoginRequestDtoValidator()
    {
        RuleFor(x => x.UsernameOrEmail)
            .NotEmpty().WithMessage("Username or Email cannot be empty.")
            .NotNull().WithMessage("Username or Email cannot be null.")
            .Matches(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
            .When(x => !string.IsNullOrEmpty(x.UsernameOrEmail)
                       && x.UsernameOrEmail.Contains('@'))
            .WithMessage("Invalid email format.")
            .Matches(@"^[a-zA-Z0-9._-]+$")
            .When(x => !string.IsNullOrEmpty(x.UsernameOrEmail)
                       && !x.UsernameOrEmail.Contains('@'))
            .WithMessage("Username can only contain alphanumeric characters.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password cannot be empty.")
            .NotNull().WithMessage("Password cannot be null.")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters long.");
    }
}