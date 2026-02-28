namespace Hukaa_back.Hub;

public class NotificationHub(
    IOnlineUserTracker tracker,
    ICurrentUserService currentUser) : Hub<INotificationHubClient>
{
    public override async Task OnConnectedAsync()
    {
        tracker.AddConnection(currentUser.UserId, Context.ConnectionId);
        await base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        tracker.RemoveConnection(currentUser.UserId, Context.ConnectionId);
        return base.OnDisconnectedAsync(exception);
    }
}