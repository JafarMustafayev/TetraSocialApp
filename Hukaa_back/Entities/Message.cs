namespace Hukaa_back.Entities;

public class Message : BaseEntity
{
    public string ConversationId { get; set; }
    public string SenderId { get; set; }
    public MessageType MessageType { get; set; }
    public string? Content { get; set; }
    public string? PostId { get; set; }
    public bool IsRead { get; set; }
    public Conversation Conversation { get; set; }
    public AppUser Sender { get; set; }
    public Post? Post { get; set; }
}