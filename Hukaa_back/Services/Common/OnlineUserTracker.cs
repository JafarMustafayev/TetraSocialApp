namespace Hukaa_back.Services.Common;

public class OnlineUserTracker : IOnlineUserTracker
{
    private readonly TimeSpan _timeout = TimeSpan.FromSeconds(20);

    private readonly ConcurrentDictionary<string, HashSet<string>> _connections = new();

    private readonly ConcurrentDictionary<string, DateTime> _heartbeat = new();

    public void AddConnection(string userId, string connectionId)
    {
        _connections.AddOrUpdate(
            userId,
            _ => new HashSet<string> { connectionId },
            (_, set) =>
            {
                lock (set)
                {
                    set.Add(connectionId);
                }

                return set;
            });

        _heartbeat[userId] = DateTime.UtcNow;
    }

    public void RemoveConnection(string userId, string connectionId)
    {
        if(_connections.TryGetValue(userId, out var set))
        {
            lock (set)
            {
                set.Remove(connectionId);

                if(set.Count == 0)
                {
                    _connections.TryRemove(userId, out _);
                }
            }
        }

        _heartbeat.TryRemove(userId, out _);
    }

    public bool IsOnline(string userId)
    {
        if(!_heartbeat.ContainsKey(userId))
        {
            return false;
        }

        return DateTime.UtcNow - _heartbeat[userId] < _timeout;
    }

    public IEnumerable<string> GetConnections(string userId)
    {
        return _connections.TryGetValue(userId, out var set)
            ? set
            : Enumerable.Empty<string>();
    }
}