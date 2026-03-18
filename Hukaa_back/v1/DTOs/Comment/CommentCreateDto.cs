namespace Hukaa_back.DTOs.Comment;

public record CommentCreateDto
{
    public string PostId { get; set; }
    public string Content { get; set; }
}