namespace Hukaa_back.Models.Identities;

public class AppUser : IdentityUser<string>
{
    public string? FistName { get; set; }
    public string? LastName { get; set; }
    public DateTime? BirthDay { get; set; }
    public Gender Gender { get; set; }
    public UserStatus UserStatus { get; set; } = UserStatus.PendingVerification;

    public AppUser()
    {
        Id = Guid.NewGuid().ToString();
        FistName = string.Empty;
        LastName = string.Empty;
        BirthDay = null;
        Gender = Gender.None;
    }
}