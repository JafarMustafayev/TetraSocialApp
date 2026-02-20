namespace Hukaa_back.Validators.Comment;

public class CommentCreateDtoValidator : AbstractValidator<CommentCreateDto>
{
    public CommentCreateDtoValidator()
    {
        RuleFor(x => x.PostId)
            .NotEmpty()
            .WithMessage("PostId cannot be empty");

        RuleFor(x => x.Content)
            .NotEmpty()
            .WithMessage("Comment content cannot be empty")
            .MaximumLength(500)
            .WithMessage("Comment cannot exceed 500 characters");
    }
}