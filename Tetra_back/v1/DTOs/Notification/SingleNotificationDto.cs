namespace Hukaa_back.DTOs.Notification;

public class SingleNotificationDto
{
    public string NotificationId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public int Type { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.MinValue;
    public string Payload { get; set; } = string.Empty;
}