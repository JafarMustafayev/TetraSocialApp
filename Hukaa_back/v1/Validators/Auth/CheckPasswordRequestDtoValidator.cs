namespace Hukaa_back.Validators.Auth;

public class CheckPasswordRequestDtoValidator : AbstractValidator<CheckPasswordRequestDto>
{
    public CheckPasswordRequestDtoValidator()
    {
        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters.");
    }
}