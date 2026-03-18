namespace Hukaa_back.Abstractions.Realtime;

public interface INotificationHubClient
{
    Task ReceiveNotification(NotificationEnvelope dto);
}