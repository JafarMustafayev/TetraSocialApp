using Tetra.Application.Abstractions.Common;
using Tetra.Application.DTOs.Account;
using Tetra.Application.Options.Validation;

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