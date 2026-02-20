namespace Hukaa_back.Validators.Post;

public class TogglePostReactionDtoValidator
    : AbstractValidator<TogglePostReactionDto>
{
    public TogglePostReactionDtoValidator()
    {
        RuleFor(x => x.ReactionType)
            .IsInEnum()
            .WithMessage("Invalid reaction type");
    }
}