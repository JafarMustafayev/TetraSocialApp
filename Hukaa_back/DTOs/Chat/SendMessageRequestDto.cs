namespace Hukaa_back.DTOs.Chat;

public class SendMessageRequestDto
{
    public string? Content { get; set; }
    public string ReceiverId { get; set; } = string.Empty;
    public string? ConversationId { get; set; }
    public string? TempConversationId { get; set; }
    public string? PostId { get; set; }
}