namespace Tetra.Domain.Entities.Users;

public class UserProfile : BaseEntity, IUpdatable
{
    public string UserId { get; set; }
    public User User { get; set; }

    public string? FirstName { get; set; } = string.Empty;
    public string? LastName { get; set; } = string.Empty;

    public DateOnly Birthday { get; set; }

    public Gender? Gender { get; set; }
    public RelationshipStatus? RelationshipStatus { get; set; }

    public string? ProfileImageUrl { get; set; }
    public string? CoverImageUrl { get; set; }

    public string? Bio { get; set; }
    public string? Website { get; set; }

    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
}