namespace Hukaa_back.Services.Common;

public class OnlineUserTracker : IOnlineUserTracker
{
    private readonly ConcurrentDictionary<string, ConcurrentDictionary<string, byte>> _userConnections = new();

    private readonly ConcurrentDictionary<string, DateTime> _connectionHeartbeat = new();

    private readonly TimeSpan _timeout = TimeSpan.FromSeconds(20);

    public void AddConnection(string userId, string connectionId)
    {
        var connections = _userConnections.GetOrAdd(userId, _ => new ConcurrentDictionary<string, byte>());
        connections.TryAdd(connectionId, 0);

        _connectionHeartbeat[connectionId] = DateTime.UtcNow;
    }

    public void RemoveConnection(string userId, string connectionId)
    {
        if(_userConnections.TryGetValue(userId, out var connections))
        {
            connections.TryRemove(connectionId, out _);

            if(connections.IsEmpty)
            {
                _userConnections.TryRemove(userId, out _);
            }
        }

        _connectionHeartbeat.TryRemove(connectionId, out _);
    }

    public bool IsOnline(string userId)
    {
        if(!_userConnections.TryGetValue(userId, out var connections))
        {
            return false;
        }

        return connections.Keys.Any(connectionId =>
            _connectionHeartbeat.TryGetValue(connectionId, out var lastSeen) &&
            DateTime.UtcNow - lastSeen < _timeout);
    }

    public IEnumerable<string> GetConnections(string userId)
    {
        if(!_userConnections.TryGetValue(userId, out var connections))
        {
            return Enumerable.Empty<string>();
        }

        return connections.Keys;
    }
}