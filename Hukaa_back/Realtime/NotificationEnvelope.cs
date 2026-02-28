namespace Hukaa_back.Realtime;

public sealed class NotificationEnvelope
{
    public NotificationType Type { get; set; } = default!;
    public object Payload { get; set; } = default!;
}