namespace Hukaa.Domain.Entities.Identities;

public class Role : IdentityRole<string>
{
    public string Description { get; set; } = string.Empty;
}