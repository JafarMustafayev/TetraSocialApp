namespace Hukaa_back.Entities;

public class WorkExperience:BaseEntity
{
    public string AppUserId { get; set; }
    public string Title { get; set; }
    public string Company {  get; set; }
    public string? Description { get; set; }
    public DateTime StartAt { get; set; }
    public DateTime? EndAt { get; set; }
    public bool IsCurrent { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime DeleteAt { get; set; }

    public AppUser AppUser { get; set; }

    public WorkExperience()
    {
        Title = string.Empty;
        Company = string.Empty;
        Description = string.Empty;
        StartAt = DateTime.MinValue;
        IsCurrent = true;
    }

}
