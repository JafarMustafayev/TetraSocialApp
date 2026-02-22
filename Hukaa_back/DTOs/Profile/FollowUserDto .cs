namespace Hukaa_back.DTOs.Profile;

public class FollowUserDto
{
    public string Id { get; set; } = default!;
    public string UserName { get; set; } = default!;
    public string? ProfileImageUrl { get; set; }
}

public class FollowerDto :FollowUserDto
{ 
}

public class FollowingDto : FollowUserDto
{
}