namespace Hukaa_back.Abstractions.Realtime;

public interface IChatHubClient
{
    Task ReceiveMessage(MessagesListItemDto message);
    Task MessagesRead(MarkAsReadDto dto);
    Task UserOnline();
    Task UserOffline();
}