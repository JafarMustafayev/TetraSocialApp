namespace Hukaa_back.Models.Identities;

public class AppUser:IdentityUser<string>
{
    public string FistName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime BirthDay { get; set; } 
    public Gender Gender { get; set; } = Gender.None;
 
}
