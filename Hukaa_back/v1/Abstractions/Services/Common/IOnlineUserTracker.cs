namespace Hukaa_back.Abstractions.Services.Common;

public interface IOnlineUserTracker
{
    void AddConnection(string userId, string connectionId);
    void RemoveConnection(string userId, string connectionId);
    bool IsOnline(string userId);
    IEnumerable<string> GetConnections(string userId);
}