namespace Hukaa_back.DTOs.Profile;

public record MyProfileDto
{
    public string UserId { get; set; }
    public string ProfileName { get; set; }
    public string Email { get; set; }
    public string? MyNumber { get; set; }

    public string FirstName { get; set; }
    public string LastName { get; set; }

    public int FollowersCount { get; set; }
    public int FollowingCount { get; set; }
    public int PostCount { get; set; }
    public string CoverImagePath { get; set; }
    public string ProfileImagePath { get; set; }

    
    public string? Bio { get; set; }
    public DateTime? BirthDay { get; set; }
    
    public RelationshipStatus? RelationshipStatus { get; set; }
    public Gender? Gender { get; set; }

    public List<SinglePostDto>? MyPosts { get; set; }
    public List<ExperienceDataDto>? Experiences { get; set; }


    public MyProfileDto()
    {
        UserId = string.Empty;
        ProfileName = string.Empty;
        Email = string.Empty;
        FollowersCount = 0;
        FollowingCount = 0;
        PostCount = 0;
        CoverImagePath = string.Empty;
        ProfileImagePath = string.Empty;
        MyPosts = new List<SinglePostDto>();
        Bio = string.Empty;
        BirthDay = DateTime.MinValue;
        MyNumber = string.Empty;
        RelationshipStatus = Enums.RelationshipStatus.None;
        Gender = Enums.Gender.None;

    }
}
