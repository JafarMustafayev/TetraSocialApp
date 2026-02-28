namespace Hukaa_back.Realtime;

public interface INotificationHubClient
{
    Task ReceiveNotification(NotificationEnvelope dto);
}