namespace Hukaa_back.Entities;

public class Comment : BaseEntity
{
    public string AppUserId { get; set; } 
    public string PostId { get; set; }  
    public string Content { get; set; } 
    public bool IsDeleted { get; set; } = false; 
    public DateTime DeletedAt {  get; set; }

    public AppUser AppUser { get; set; }
    public Post Post { get; set; }
}