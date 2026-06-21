namespace Tetra.Domain.Entities.Identities;

public class Role : IdentityRole<string>
{
    public override string Id { get; set; } = Guid.NewGuid().ToString();
    public string Description { get; set; } = string.Empty;
}