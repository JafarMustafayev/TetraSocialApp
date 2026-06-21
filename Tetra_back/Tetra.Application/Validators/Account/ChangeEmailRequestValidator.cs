namespace Tetra.Application.Validators.Account;

public class ChangeEmailRequestValidator : AbstractValidator<ChangeEmailRequestDto>
{
    public ChangeEmailRequestValidator(
        IAppConfig appConfig,
        ILocalizationService localizer)
    {
        var rules = appConfig.GetSection<ValidationOptions>().Auth.Register;

        RuleFor(x => x.Email)
            .Cascade(CascadeMode.Stop)
            .ApplyStringValidation(
                rules.Email,
                localizer,
                "Email");

        RuleFor(x => x.Password)
            .Cascade(CascadeMode.Stop)
            .ApplyStringValidation(
                rules.Password,
                localizer,
                "Password");
    }
}