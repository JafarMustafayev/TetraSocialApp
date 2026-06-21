namespace Tetra.Application.Validators.Auth;

public sealed class LoginRequestValidator : AbstractValidator<LoginRequestDto>
{
    public LoginRequestValidator(
        ILocalizationService localizer,
        IAppConfig appConfig)
    {
        var rules = appConfig.GetSection<ValidationOptions>().Auth.Login;

        RuleFor(x => x.EmailOrUsername)
            .Cascade(CascadeMode.Stop)
            .ApplyStringValidation(
                rules.EmailOrUsername,
                localizer,
                "EmailOrUsername")
            .Must(LoginRequestValidator.BeValidEmailOrUsername)
            .WithMessage(localizer.Get("Validation.Common.Validation.InvalidEmailOrUsername"));

        RuleFor(x => x.Password)
            .Cascade(CascadeMode.Stop)
            .ApplyStringValidation(
                rules.Password,
                localizer,
                "Password");
    }

    private static bool BeValidEmailOrUsername(string? emailOrUsername)
    {
        if(string.IsNullOrWhiteSpace(emailOrUsername))
        {
            return false;
        }

        if(Regex.IsMatch(emailOrUsername, @"[^@\s]+@[^@\s]+\.[^@\s]+"))
        {
            return true;
        }

        return Regex.IsMatch(emailOrUsername, @"^[a-zA-Z0-9]+$");
    }
}