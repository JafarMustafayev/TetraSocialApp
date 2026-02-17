namespace Hukaa_back.Entities;

public class Reaction:BaseEntity
{
    public string AppUserId { get; set; }
    public string PostId { get; set; }
    public ReactionType ReactionType { get; set; }

    public AppUser AppUser { get; set; }
    public Post Post { get; set; }

    public bool IsDeleted { get; set; }
    public DateTime DeleteAt { get; set; }
}
