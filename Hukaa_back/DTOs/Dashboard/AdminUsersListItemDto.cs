namespace Hukaa_back.DTOs.Dashboard;

public class AdminUsersListItemDto
{
    public string Id { get; set; } = null!;
    public string UserName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public bool IsBanned { get; set; }
    public string CreateAt { get; set; } = null!;
    public int PostsCount { get; set; }
    public string ProfilePicture { get; set; } = null!;
}
