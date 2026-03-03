namespace Hukaa_back.Hub;

public abstract class BaseHub<T> : Hub<T> where T : class
{
    protected readonly IOnlineUserTracker tracker;
    protected readonly ICurrentUserService currentUser;

    protected BaseHub(
        IOnlineUserTracker tracker,
        ICurrentUserService currentUser)
    {
        this.tracker = tracker;
        this.currentUser = currentUser;
    }

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