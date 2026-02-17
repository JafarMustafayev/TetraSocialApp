namespace Hukaa_back.DTOs.Post;

public class SinglePostDto
{
    public string Id { get; set; }

    public string UserId {  get; set; }
    public string UserName { get; set; }
    public string UserImage {  get; set; }
    public string Content { get; set; }
    public DateTime CreateAt { get; set; }
    public int TotalReactionCount { get; set; }
    public ReactionType? MyReaction { get; set; }
    public int ShareCount { get; set; }
    public int CommentCount { get; set; }
    public bool CanYouEdit { get; set; }
    public bool CanYouDelete { get; set; }

    public ICollection<string>? ImageUrl { get; set; }



    public SinglePostDto()
    {
        UserId = string.Empty;
        UserName = string.Empty;
        UserImage = string.Empty;
        CreateAt = DateTime.MinValue;
        TotalReactionCount = 0;
        ShareCount = 0;
        CommentCount = 0;
        CanYouEdit = false;
        CanYouDelete = false;
        Content = string.Empty;
    }
}
