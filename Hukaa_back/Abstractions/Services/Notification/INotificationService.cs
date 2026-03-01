namespace Hukaa_back.Abstractions.Services.Notification;

public interface INotificationService
{
    Task<ResponseDto> GetNotificationsAsync(int page = 1, int take = 10);

    Task SendPostReactedNotificationAsync(
        string postId,
        string postOwnerId,
        ReactionType reaction);

    Task SendCommentNotificationAsync(
        string postId,
        string commentId,
        string commentBody,
        string postOwnerId);

    Task SendFollowNotificationAsync(string followedUserId);
    Task SendFollowRequestReceivedNotificationAsync(string requestedUserId);
    Task SendFollowRequestAcceptedNotificationAsync(string requesterUserId);
    Task<ResponseDto> ReadNotificationsAsync(string notificationId);
    Task<ResponseDto> ReadAllNotificationsAsync();
}