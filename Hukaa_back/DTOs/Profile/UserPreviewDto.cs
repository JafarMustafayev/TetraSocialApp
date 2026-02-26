namespace Hukaa_back.DTOs.Profile;

public class UserPreviewDto
{
    public string Id { get; set; } = default!;
    public string UserName { get; set; } = default!;
    public string? ProfileImageUrl { get; set; }
}

public class FollowerPreviewDto : UserPreviewDto
{
}

public class FollowingPreviewDto : UserPreviewDto
{
}