namespace Hukaa_back.DTOs.Experience;

public class CreateExperienceDto
{
    public string Company { get; set; }
    public string Position { get; set; }
    public string Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    public CreateExperienceDto()
    {
        Company = string.Empty;
        Position = string.Empty;
        Description = string.Empty;
        StartDate = DateTime.MinValue;

    }
}
