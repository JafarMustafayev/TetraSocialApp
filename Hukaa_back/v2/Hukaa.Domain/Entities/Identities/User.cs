namespace Hukaa.Domain.Entities.Identities;

public class User : IdentityUser<string>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public override string Email { get; set; } = string.Empty;
    public override string UserName { get; set; } = string.Empty;
}