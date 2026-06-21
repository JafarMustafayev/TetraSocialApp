namespace Hukaa_back.Validators.Experience;

public class UpdateExperienceDtoValidator : AbstractValidator<UpdateExperienceDto>
{
    public UpdateExperienceDtoValidator()
    {
        RuleFor(x => x.Company)
            .NotEmpty().WithMessage("Company is required")
            .MaximumLength(150);

        RuleFor(x => x.Position)
            .NotEmpty().WithMessage("Position is required")
            .MaximumLength(150);

        RuleFor(x => x.Description)
            .MaximumLength(1000);

        RuleFor(x => x.StartDate)
            .NotEqual(DateTime.MinValue)
            .WithMessage("Start date is required")
            .LessThanOrEqualTo(DateTime.Now)
            .WithMessage("Start date cannot be in the future");

        RuleFor(x => x.EndDate)
            .GreaterThan(x => x.StartDate)
            .When(x => x.EndDate.HasValue)
            .WithMessage("End date must be greater than start date");
    }
}