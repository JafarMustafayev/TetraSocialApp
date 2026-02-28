namespace Hukaa_back.Entities;

public class SavedPost : BaseEntity
{
    public string AppUserId { get; set; }
    public string PostId { get; set; }

    public AppUser AppUser { get; set; }
    public Post Post { get; set; }
}