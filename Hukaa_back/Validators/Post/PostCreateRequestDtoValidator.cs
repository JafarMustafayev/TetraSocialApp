namespace Hukaa_back.Validators.Post;

public class PostCreateRequestDtoValidator
    : AbstractValidator<PostCreateRequestDto>
{
    private static readonly string[] AllowedImageExtensions =
    {
        ".jpg", ".jpeg", ".png", ".webp"
    };

    private static readonly string[] AllowedVideoExtensions =
    {
        ".mp4", ".mov", ".avi", ".mkv"
    };

    public PostCreateRequestDtoValidator()
    {
        RuleFor(x => x.Files)
            .Must(files => files == null || files.Count <= 10)
            .WithMessage("You can upload a maximum of 10 files.");

        RuleFor(x => x)
            .Must(dto =>
            {
                var hasContent = !string.IsNullOrWhiteSpace(dto.Content);
                var hasFiles = dto.Files != null && dto.Files.Count > 0;

                return hasContent || hasFiles;
            })
            .WithMessage("Either Content or at least 1 file must be sent for the post.");
        
        RuleFor(x=>x.Content)
            .MaximumLength(1000)
            .WithMessage("Content must not exceed 1000 characters.");

        // 3. File extension whitelist
        RuleForEach(x => x.Files)
            .Must(file => BeValidExtension(file))
            .WithMessage("Only images (.jpg, .jpeg, .png, .webp) and videos (.mp4, .mov, .avi, .mkv) are accepted.");
    }

    private bool BeValidExtension(IFormFile file)
    {
        if (file == null) return false;

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        return AllowedImageExtensions.Contains(extension)
               || AllowedVideoExtensions.Contains(extension);
    }
}
