namespace Hukaa_back.Realtime;

public sealed class NotificationEnvelope
{
    public required string NotificationId { get; set; }
    public required string Title { get; set; }
    public required NotificationType Type { get; set; }
    public required DateTime CreatedAt { get; set; }
    public object Payload { get; set; } = default!;
}