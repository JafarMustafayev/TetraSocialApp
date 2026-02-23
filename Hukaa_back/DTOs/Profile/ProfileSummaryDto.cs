namespace Hukaa_back.DTOs.Profile;

public class ProfileSummaryDto
{
    public string UserId { get; set; } = string.Empty;
    public string ProfileName { get; set; } = string.Empty;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public int FollowersCount { get; set; } = 0;
    public int FollowingCount { get; set; } = 0;
    public int PostCount { get; set; } = 0;
    public string CoverImagePath { get; set; } = string.Empty;
    public string ProfileImagePath { get; set; } = string.Empty;
    public bool IsPrivateProfile { get; set; } = true;
    public bool IsFollowing { get; set; } = false;
}

public class ProfileDetailsDto:ProfileSummaryDto
{
    public string Email { get; set; } = null!;
    public string? PhoneNumber { get; set; }
    public string? Bio { get; set; }
    public DateTime? BirthDay { get; set; }
    public RelationshipStatus? RelationshipStatus { get; set; }
    public Gender? Gender { get; set; }
    public List<ExperienceDataDto>? Experiences { get; set; }

    public ProfileDetailsDto()
    {
        IsPrivateProfile = false;
    }
}
