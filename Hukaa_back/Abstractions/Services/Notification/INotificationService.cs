namespace Hukaa_back.Abstractions.Services.Notification;

public interface INotificationService
{
    Task SendPostReactedNotificationAsync(string postId, string postOwnerId, ReactionType reaction);
    Task SendCommentNotificationAsync(string postId, string commentId, string commentBody, string postOwnerId);
    Task SendFollowNotificationAsync(string followedUserId, string followerUserId);
    Task MarkAsReadAsync(string notificationId);
}