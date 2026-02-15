namespace Hukaa_back.Models.Common;

public abstract class BaseEntity
{
    public string Id { get; set; }
    public DateTime CreatedAt { get; set; }

    public BaseEntity()
    {
        CreatedAt = DateTime.UtcNow;
        Id = Guid.NewGuid().ToString();
    }
}