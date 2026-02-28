namespace Hukaa_back.Services.Notification;

public class NotificationService(
    ICurrentUserService currentUser,
    IHubContext<NotificationHub, INotificationHubClient> hubContext,
    AppDbContext context) : INotificationService
{
    public async Task SendPostReactedNotificationAsync(string postId, string postOwnerId, ReactionType reaction)
    {
        var userId = currentUser.UserId;
        var user = await FindUserAsync(userId);
        var data = new
        {
            PostId = postId,
            LikedOn = DateTime.UtcNow,
            ReactionType = reaction,

            LikedByUserId = userId,
            LikedByUserName = user.UserName,
            LikedByUserProfileImageUrl = user.ProfileImageUrl
        };

        await hubContext.Clients
            .User(postOwnerId).ReceiveNotification(new NotificationEnvelope
            {
                Type = NotificationType.PostReactedNotification,
                Payload = data
            });
    }

    public Task SendCommentNotificationAsync(string postId, string commentId, string commentBody, string postOwnerId)
    {
        throw new NotImplementedException();
    }

    public Task SendFollowNotificationAsync(string followedUserId, string followerUserId)
    {
        throw new NotImplementedException();
    }

    public Task MarkAsReadAsync(string notificationId)
    {
        throw new NotImplementedException();
    }

    private async Task<UserPreviewDto?> FindUserAsync(string userId)
    {
        var user = await context.Users
            .Where(x => x.Id == userId)
            .Select(x => new UserPreviewDto
            {
                UserName = x.UserName ?? "UserName",
                ProfileImageUrl = x.ProfilePhotoPath
            })
            .FirstOrDefaultAsync();

        return user;
    }
}