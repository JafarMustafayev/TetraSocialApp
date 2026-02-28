namespace Hukaa_back.Validators.Post;

public class TogglePostArchiveStatusDtoValidator : AbstractValidator<TogglePostArchiveStatusDto>
{
    public TogglePostArchiveStatusDtoValidator()
    {
        RuleFor(x => x.IsArchive).NotNull();
    }
}