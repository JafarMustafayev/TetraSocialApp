namespace Hukaa_back.DTOs.Experience;

public class ExperienceDataDto
{
    public string Id { get; set; }
    public string Position { get; set; }
    public string Company { get; set; }
    public string Description { get; set; }
    public bool IsCurrent { get; set; }
    public DateTime StartAt { get; set; }
    public DateTime? EndAt { get; set; }

    public ExperienceDataDto()
    {
        Id = string.Empty;
        Position = string.Empty;
        Company = string.Empty;
        Description = string.Empty;
        IsCurrent = false;
        StartAt = DateTime.MinValue;
    }
}