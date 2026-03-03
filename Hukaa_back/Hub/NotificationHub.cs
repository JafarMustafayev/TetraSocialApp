namespace Hukaa_back.Hub;

public class NotificationHub(
    IOnlineUserTracker tracker,
    ICurrentUserService currentUser) : BaseHub<INotificationHubClient>(tracker, currentUser)
{
}