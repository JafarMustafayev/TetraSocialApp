namespace Hukaa_back.Validators.Post;

public class PostUpdateRequestDtoValidator:AbstractValidator<PostUpdateRequestDto>
{
    public PostUpdateRequestDtoValidator()
    {
        RuleFor(dto => dto.Content)
            .MaximumLength(1000)
            .WithMessage("Content must not exceed 1000 characters");
            
    }
}
