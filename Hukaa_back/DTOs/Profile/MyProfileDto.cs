namespace Hukaa_back.DTOs.Profile;

public record MyProfileDto
{
    public string UserId { get; set; }
    public string ProfileName { get; set; }
    public string Email { get; set; }

    public int FollowersCount { get; set; }
    public int FollowingCount { get; set; }
    public int PostCount { get; set; }
    public string CoverImagePath { get; set; }
    public string ProfileImagePath { get; set; }

    public List<SinglePostDto>? MyPosts { get; set; }
    public AbouteMeDto AbouteMe { get; set; }


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
        AbouteMe = new AbouteMeDto();
    }
}
