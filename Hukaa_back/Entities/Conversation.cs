namespace Hukaa_back.Entities;

public class Conversation : BaseEntity
{
    public string InitiatorId { get; set; }
    public string RecipientId { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
    public AppUser Initiator { get; set; }
    public AppUser Recipient { get; set; }

    public ICollection<Message>? Messages { get; set; }
}