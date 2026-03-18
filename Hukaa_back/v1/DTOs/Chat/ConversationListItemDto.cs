namespace Hukaa_back.DTOs.Chat;

public class ConversationListItemDto
{
    public string ConversationId { get; set; } = string.Empty;
    public UserPreviewDto User { get; set; }
    public MessagesListItemDto LastMessage { get; set; }
    public int UnreadMessagesCount { get; set; }
}