namespace Hukaa_back.DTOs.Post;

public class PostCreateRequestDto
{
    public string? Content { get; set; } = string.Empty;

    public List<IFormFile>? Files { get; set; } = new();
}
