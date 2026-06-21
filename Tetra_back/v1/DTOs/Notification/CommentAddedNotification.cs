namespace Hukaa_back.DTOs.Notification;

public sealed record CommentAddedNotification : BaseNotification
{
    public required string PostId { get; init; }
    public required string CommentId { get; init; }
    public required string CommentBody { get; init; }
}