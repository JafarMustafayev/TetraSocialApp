namespace Hukaa_back.Entities;

public class Post : BaseEntity
{
    public string AppUserId { get; set; }
    public string Content { get; set; }
    public bool IsArchived { get; set; }
    public int ShareCounter { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeleteAt { get; set; }

    public ICollection<PostFile>? PostFiles { get; set; }
    public AppUser AppUser { get; set; }
    public ICollection<Reaction>? Reactions { get; set; }
    public ICollection<Comment>? Comments { get; set; }

    public Post()
    {
        AppUserId = string.Empty;
        Content = string.Empty;
        IsArchived = false;
        IsDeleted = false;
        ShareCounter = 0;
        CreatedAt = DateTime.UtcNow;
    }
}