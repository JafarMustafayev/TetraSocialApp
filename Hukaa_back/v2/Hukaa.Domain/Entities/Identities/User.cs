namespace Hukaa.Domain.Entities.Identities;

public class User : IdentityUser<string>
{
    public override string Id { get; set; } = Guid.NewGuid().ToString();
    public string? FirstName { get; set; } = string.Empty;
    public string? LastName { get; set; } = string.Empty;
    public override string Email { get; set; } = string.Empty;
    public override string UserName { get; set; } = string.Empty;
    public string PreferredLanguage { get; set; } = "en";
    public UserStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }

    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}