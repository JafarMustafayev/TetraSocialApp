namespace Hukaa_back.Validators.Auth;

public class ChangeUsernameDtoValidator : AbstractValidator<ChangeUsernameDto>
{
    public ChangeUsernameDtoValidator()
    {
        RuleFor(x => x.UserName)
            .NotEmpty().WithMessage("Username is required.")
            .MinimumLength(3).WithMessage("Username must be at least 3 characters.")
            .MaximumLength(50).WithMessage("Username cannot exceed 50 characters.")
            .Matches("^[a-zA-Z0-9._-]+$")
            .WithMessage("Username can only contain letters, numbers, dot, underscore and hyphen.");
    }
}
