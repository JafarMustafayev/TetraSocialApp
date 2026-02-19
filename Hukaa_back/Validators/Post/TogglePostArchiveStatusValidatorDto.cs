namespace Hukaa_back.Validators.Post;

public class TogglePostArchiveStatusValidatorDto:AbstractValidator<TogglePostArchiveStatusDto>
{
    public TogglePostArchiveStatusValidatorDto()
    {
        RuleFor(x => x.IsArchive).NotNull();
    }
}
