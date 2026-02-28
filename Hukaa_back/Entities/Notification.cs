namespace Hukaa_back.Entities;

public class Notification : BaseEntity
{
    public string? UserId { get; set; }
    public NotificationType Type { get; set; }
    public string Title { get; set; } = string.Empty;
    public string PayloadJson { get; set; } = string.Empty;
    public AppUser User { get; set; }


    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }
}