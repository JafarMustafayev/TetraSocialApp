namespace Hukaa_back.DTOs.Post;

public class SinglePostDto
{
    public string Id { get; set; }

    public string UserId { get; set; }
    public string UserName { get; set; }
    public string UserImage { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public int TotalReactionCount { get; set; }
    public ReactionType? MyReaction { get; set; }
    public bool IsSaved { get; set; }
    public int ShareCount { get; set; }
    public int CommentCount { get; set; }
    public bool IsOwner { get; set; }

    public ICollection<PostFileDto>? PostFiles { get; set; }

    public SinglePostDto()
    {
        UserId = string.Empty;
        UserName = string.Empty;
        UserImage = string.Empty;
        CreatedAt = DateTime.MinValue;
        TotalReactionCount = 0;
        ShareCount = 0;
        CommentCount = 0;
        IsOwner = false;
        Content = string.Empty;
        IsSaved = false;
    }
}