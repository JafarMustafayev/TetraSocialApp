namespace Hukaa_back.Abstractions.Realtime;

public interface IChatHubClient
{
    Task ReceiveMessage(MessagesListItemDto message);
    Task MessagesRead(ConversationActionDto dto);
    Task DeleteConversation(ConversationActionDto dto);
    Task UserOnline(string userId);
    Task UserOffline(string userId);
}