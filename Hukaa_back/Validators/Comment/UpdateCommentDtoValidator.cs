namespace Hukaa_back.Validators.Comment;

public class UpdateCommentDtoValidator:AbstractValidator<UpdateCommentDto>
{
    public UpdateCommentDtoValidator()
    {
        RuleFor(x => x.Content)
           .NotEmpty()
           .WithMessage("Comment content cannot be empty")
           .MaximumLength(500)
           .WithMessage("Comment cannot exceed 500 characters");
    }
}
