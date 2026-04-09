namespace Hukaa.Application.Validators.Auth;

public class LoginRequestValidator : AbstractValidator<LoginRequestDto>
{
    public LoginRequestValidator(
        ILocalizationService localizer,
        IAppConfig appConfig)
    {
        var rules = appConfig.GetSection<ValidationRulesOptions>().Auth.Login;

        RuleFor(request => request.EmailOrUsername)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .When(_ => rules.EmailOrUsername.Required)
            .WithMessage(localizer.Get("Validation.Common.Required", "EmailOrUsername"))
            .MinimumLength(rules.EmailOrUsername.MinLength ?? 0)
            .When(_ => rules.EmailOrUsername.Required)
            .WithMessage(localizer.Get("Validation.Common.MinLength", "EmailOrUsername",
                new Dictionary<string, object> { ["MinLength"] = rules.EmailOrUsername.MinLength ?? 5 }))
            .MaximumLength(rules.EmailOrUsername.MaxLength ?? int.MaxValue)
            .When(_ => rules.EmailOrUsername.Required)
            .WithMessage(localizer.Get("Validation.Common.MaxLength", "EmailOrUsername",
                new Dictionary<string, object> { ["MaxLength"] = rules.EmailOrUsername.MaxLength ?? int.MaxValue }))
            .Must(BeValidEmailOrUsername)
            .WithMessage(localizer.Get("Validation.Common.InvalidEmailOrUsername"));

        RuleFor(x => x.Password)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().When(_ => rules.Password.Required)
            .WithMessage(localizer.Get("Validation.Common.Required", "Password"))
            .MinimumLength(rules.Password.MinLength ?? 0).When(_ => rules.Password.Required)
            .WithMessage(
                localizer.Get("Validation.Common.MinLength", "Password", new Dictionary<string, object>
                {
                    ["MinLength"] = rules.Password.MinLength ?? 0
                }))
            .MaximumLength(rules.Password.MaxLength ?? int.MaxValue).When(_ => rules.Password.Required)
            .WithMessage(
                localizer.Get("Validation.Common.MaxLength", "Password", new Dictionary<string, object>
                {
                    ["MaxLength"] = rules.Password.MaxLength ?? int.MaxValue
                }));
    }

    private bool BeValidEmailOrUsername(string emailOrUsername)
    {
        if(Regex.IsMatch(emailOrUsername, @"[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+"))
        {
            return true;
        }

        return Regex.IsMatch(emailOrUsername, @"^[a-zA-Z0-9]+$");
    }
}