namespace Hukaa_back.DTOs.Chat;

public class MessagesListItemDto
{
    public string MessageId { get; set; } = string.Empty;
    public string SenderId { get; set; } = string.Empty;
    public bool IsOwner { get; set; }
    public DateTime SentAt { get; set; }
    public string Content { get; set; } = string.Empty;
    public bool IsRead { get; set; } = false;
    public MessageType Type { get; set; } = MessageType.Text;
}