namespace Hukaa.Application.Validators.Auth;

public class RegisterRequestValidator : AbstractValidator<RegisterRequestDto>
{
    public RegisterRequestValidator(
        ILocalizationService localizer,
        IAppConfig appConfig)
    {
        var rules = appConfig.GetSection<ValidationRulesOptions>().Auth.Register;

        RuleFor(x => x.Email)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().When(_ => rules.Email.Required)
            .WithMessage(localizer.Get("Validation.Common.Validation.Required", "Email"))
            .EmailAddress().WithMessage(localizer.Get("Validation.Common.Validation.InvalidEmail"))
            .MinimumLength(rules.Email.MinLength ?? 0).When(_ => rules.Email.Required)
            .WithMessage(
                localizer.Get("Validation.Common.Validation.MinLength", "Email", new Dictionary<string, object>
                {
                    ["MinLength"] = rules.Email.MinLength ?? 0
                }))
            .MaximumLength(rules.Email.MaxLength ?? int.MaxValue).When(_ => rules.Email.Required)
            .WithMessage(
                localizer.Get("Validation.Common.Validation.MaxLength", "Email", new Dictionary<string, object>
                {
                    ["MaxLength"] = rules.Email.MaxLength ?? int.MaxValue
                }));

        RuleFor(x => x.Username)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().When(_ => rules.UserName.Required)
            .WithMessage(localizer.Get("Validation.Common.Validation.Required", "Username"))
            .MinimumLength(rules.UserName.MinLength ?? 0).When(_ => rules.UserName.Required)
            .WithMessage(
                localizer.Get("Validation.Common.Validation.MinLength", "Username", new Dictionary<string, object>
                {
                    ["MinLength"] = rules.UserName.MinLength ?? 0
                }))
            .MaximumLength(rules.UserName.MaxLength ?? int.MaxValue).When(_ => rules.UserName.Required)
            .WithMessage(
                localizer.Get("Validation.Common.Validation.MaxLength", "Username", new Dictionary<string, object>
                {
                    ["MaxLength"] = rules.UserName.MaxLength ?? int.MaxValue
                }));

        RuleFor(x => x.Password)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().When(_ => rules.Password.Required)
            .WithMessage(localizer.Get("Validation.Common.Validation.Required", "Password"))
            .MinimumLength(rules.Password.MinLength ?? 0).When(_ => rules.Password.Required)
            .WithMessage(
                localizer.Get("Validation.Common.Validation.MinLength", "Password", new Dictionary<string, object>
                {
                    ["MinLength"] = rules.Password.MinLength ?? 0
                }))
            .MaximumLength(rules.Password.MaxLength ?? int.MaxValue).When(_ => rules.Password.Required)
            .WithMessage(
                localizer.Get("Validation.Common.Validation.MaxLength", "Password", new Dictionary<string, object>
                {
                    ["MaxLength"] = rules.Password.MaxLength ?? int.MaxValue
                }));

        RuleFor(x => x.DateOfBirth)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().When(_ => rules.DateOfBirth.Required)
            .WithMessage(localizer.Get("Validation.Common.Validation.Required", "DateOfBirth"));

        RuleFor(x => x.FirstName)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().When(_ => rules.FirstName.Required)
            .WithMessage(localizer.Get("Validation.Common.Validation.Required", "FirstName"))
            .MinimumLength(rules.FirstName.MinLength ?? 0).When(_ => rules.FirstName.Required)
            .WithMessage(
                localizer.Get("Validation.Common.Validation.MinLength", "FirstName", new Dictionary<string, object>
                {
                    ["MinLength"] = rules.FirstName.MinLength ?? 0
                }))
            .MaximumLength(rules.FirstName.MaxLength ?? int.MaxValue).When(_ => rules.FirstName.Required)
            .WithMessage(
                localizer.Get("Validation.Common.Validation.MaxLength", "FirstName", new Dictionary<string, object>
                {
                    ["MaxLength"] = rules.FirstName.MaxLength ?? int.MaxValue
                }));

        RuleFor(x => x.LastName)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().When(_ => rules.LastName.Required)
            .WithMessage(localizer.Get("Validation.Common.Validation.Required", "LastName"))
            .MinimumLength(rules.LastName.MinLength ?? 0).When(_ => rules.LastName.Required)
            .WithMessage(
                localizer.Get("Validation.Common.Validation.MinLength", "LastName", new Dictionary<string, object>
                {
                    ["MinLength"] = rules.LastName.MinLength ?? 0
                }))
            .MaximumLength(rules.LastName.MaxLength ?? int.MaxValue).When(_ => rules.LastName.Required)
            .WithMessage(
                localizer.Get("Validation.Common.Validation.MaxLength", "LastName", new Dictionary<string, object>
                {
                    ["MaxLength"] = rules.LastName.MaxLength ?? int.MaxValue
                }));
    }
}