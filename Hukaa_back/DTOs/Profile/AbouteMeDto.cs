namespace Hukaa_back.DTOs.Profile;

public class AbouteMeDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string? Bio {  get; set; }
    public DateTime? BirthDay { get; set; }
    public string? MyNumber { get; set; }
    public RelationshipStatus? RelationshipStatus { get; set; }
    public Gender? Gender { get; set; }
    public List<ExperienceDataDto>? Experiences { get; set; }

    public AbouteMeDto()
    {
        Bio = string.Empty;
        BirthDay = DateTime.MinValue;
        MyNumber = string.Empty;
        RelationshipStatus = Enums.RelationshipStatus.None;
        Gender = Enums.Gender.None;
        Experiences = new List<ExperienceDataDto>();
    }

}
