namespace Hukaa_back.DTOs.Comment;

public record CommentDto
{
    public string UserId { get; set; }
    public string UserName { get; set; }
    public string UserImage { get; set; }

    public string Id { get; set; }
    public string PostId { get; set; }
    public string AppUserId { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsOwner { get; set; }
}