namespace Tetra.Application.Validators.Account;

public class ChangeUsernameRequestValidator : AbstractValidator<ChangeUsernameRequestDto>
{
    public ChangeUsernameRequestValidator(
        IAppConfig appConfig,
        ILocalizationService localizer)
    {
        var rules = appConfig.GetSection<ValidationOptions>().Auth.Register;

        RuleFor(x => x.Username)
            .Cascade(CascadeMode.Stop)
            .ApplyStringValidation(
                rules.UserName,
                localizer,
                "Username");
    }
}