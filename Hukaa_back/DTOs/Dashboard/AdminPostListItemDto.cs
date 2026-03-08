namespace Hukaa_back.DTOs.Dashboard;

public class AdminPostListItemDto
{
    public string Id { get; set; }
    public string UserName { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public int TotalReactionCount { get; set; }
    public int ShareCount { get; set; }
    public int CommentCount { get; set; }
    public ICollection<PostFileDto>? PostFiles { get; set; }
}
