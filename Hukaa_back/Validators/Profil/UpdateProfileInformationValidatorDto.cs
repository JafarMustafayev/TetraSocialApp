namespace Hukaa_back.Validators.Profil;

public class UpdateProfileInformationValidatorDto : AbstractValidator<UpdateProfileInformationDto>
{
    public UpdateProfileInformationValidatorDto()
    {
        // FirstName
        RuleFor(x => x.FirstName)
            .MaximumLength(50).WithMessage("First name cannot exceed 50 characters.")
            .Matches("^[a-zA-Z]+$")
            .When(x => !string.IsNullOrWhiteSpace(x.FirstName) && !string.IsNullOrEmpty(x.FirstName))
            .WithMessage("First name must contain only letters.");

        // LastName
        RuleFor(x => x.LastName)
            .MaximumLength(50).WithMessage("Last name cannot exceed 50 characters.")
            .Matches("^[a-zA-Z]+$")
            .When(x => !string.IsNullOrWhiteSpace(x.LastName) && !string.IsNullOrEmpty(x.LastName))
            .WithMessage("Last name must contain only letters.");

        // BirthDay
        RuleFor(x => x.BirthDay)
            .Must(BeAValidAge).WithMessage("User must be at least 18 years old.")
            .When(x => x.BirthDay != null);

        // Gender
        RuleFor(x => x.Gender)
            .IsInEnum().WithMessage("Invalid gender selected.");

        // RelationshipStatus
        RuleFor(x => x.RelationshipStatus)
            .IsInEnum().WithMessage("Invalid relationship status.");

        // Bio
        RuleFor(x => x.Bio)
            .MaximumLength(300)
            .WithMessage("Bio cannot exceed 300 characters.");
    }

    private bool BeAValidAge(DateTime? birthDate)
    {
        if (!birthDate.HasValue)
            return false;

        var today = DateTime.Today;
        var age = today.Year - birthDate.Value.Year;

        if (birthDate.Value.Date > today.AddYears(-age))
            age--;

        return age >= 1;
    }
}