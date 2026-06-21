namespace Tetra.Application.Validators.Auth;

public sealed class RegisterRequestValidator : AbstractValidator<RegisterRequestDto>
{
    public RegisterRequestValidator(
        ILocalizationService localizer,
        IAppConfig appConfig)
    {
        var rules = appConfig.GetSection<ValidationOptions>().Auth.Register;

        RuleFor(x => x.Email)
            .Cascade(CascadeMode.Stop)
            .ApplyStringValidation(
                rules.Email,
                localizer,
                "Email")
            .EmailAddress()
            .WithMessage(localizer.Get("Validation.Common.Validation.InvalidEmail"));

        RuleFor(x => x.Username)
            .Cascade(CascadeMode.Stop)
            .ApplyStringValidation(
                rules.UserName,
                localizer,
                "Username");

        RuleFor(x => x.Password)
            .Cascade(CascadeMode.Stop)
            .ApplyStringValidation(
                rules.Password,
                localizer,
                "Password");

        RuleFor(x => x.DateOfBirth)
            .Cascade(CascadeMode.Stop)
            .ApplyDateTimeValidation(
                rules.DateOfBirth,
                localizer,
                "DateOfBirth");

        RuleFor(x => x.FirstName)
            .Cascade(CascadeMode.Stop)!
            .ApplyStringValidation(
                rules.FirstName,
                localizer,
                "FirstName");

        RuleFor(x => x.LastName)
            .Cascade(CascadeMode.Stop)!
            .ApplyStringValidation(
                rules.LastName,
                localizer,
                "LastName");
    }
}