namespace Hukaa_back.Entities.Identities;

public class AppUser : IdentityUser<string>
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateTime? BirthDay { get; set; }
    public Gender Gender { get; set; }
    public AccountType AccountType { get; set; }
    public RelationshipStatus RelationshipStatus { get; set; }
    public string ProfilePhotoPath { get; set; }
    public string CoverPhotoPath { get; set; }
    public string? Bio { get; set; }
    public UserStatus UserStatus { get; set; }

    public ICollection<Post> Posts { get; set; }
    public ICollection<WorkExperience> WorkExperiences { get; set; }
    public ICollection<Reaction> Reactions { get; set; }
    public ICollection<Comment> Comments { get; set; }
    public ICollection<Follow> Following { get; set; }
    public ICollection<Follow> Followers { get; set; }
    public ICollection<SavedPost> SavedPosts { get; set; }


    public AppUser()
    {
        Id = Guid.NewGuid().ToString();
        FirstName = string.Empty;
        LastName = string.Empty;
        BirthDay = null;
        Gender = Gender.None;
        RelationshipStatus = RelationshipStatus.None;
        ProfilePhotoPath = string.Empty;
        CoverPhotoPath = string.Empty;
        Bio = string.Empty;
        UserStatus = UserStatus.PendingVerification;
        AccountType = AccountType.PrivateAccount;
    }
}