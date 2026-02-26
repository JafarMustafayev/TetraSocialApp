namespace Hukaa_back.Validators.Auth;

public class ResetPasswordRequestDtoValidator : AbstractValidator<ResetPasswordRequestDto>
{
    public ResetPasswordRequestDtoValidator()
    {
        RuleFor(request => request.Token)
            .NotNull().WithMessage("Token is required")
            .NotEmpty().WithMessage("Token is required");

        RuleFor(request => request.Email)
            .NotNull().WithMessage("Email is required")
            .NotEmpty().WithMessage("Email is required");

        RuleFor(x => x.Password)
            .NotNull().WithMessage("Password cannot be null.")
            .NotEmpty().WithMessage("Password cannot be empty.")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters long.");

        RuleFor(x => x.ConfirmPassword)
            .NotNull().WithMessage("Confirm Password cannot be null.")
            .NotEmpty().WithMessage("Confirm Password cannot be empty.")
            .Equal(x => x.Password).WithMessage("Passwords do not match.")
            .MinimumLength(6).WithMessage("Confirm Password must be at least 6 characters long.");
    }
}