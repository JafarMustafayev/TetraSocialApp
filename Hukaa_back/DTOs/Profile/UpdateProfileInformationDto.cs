namespace Hukaa_back.DTOs.Profile;

public class UpdateProfileInformationDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateTime? BirthDay { get; set; }
    public Gender Gender { get; set; }
    public RelationshipStatus RelationshipStatus { get; set; }
    public string? Bio { get; set; }
    public string? PhoneNumber { get; set; }
}