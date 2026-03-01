namespace Hukaa_back.Services.Notification;

public class NotificationService(
    ICurrentUserService currentUser,
    IHubContext<NotificationHub, INotificationHubClient> hubContext,
    AppDbContext context,
    IMapper mapper) : INotificationService
{
    public async Task<ResponseDto> GetNotificationsAsync(int page, int take)
    {
        var userId = currentUser.UserId;

        var notifications = await context.Notifications
            .Where(notification =>
                notification.UserId == userId
                && !notification.IsRead)
            .OrderByDescending(n => n.CreatedAt)
            .Skip((page - 1) * take).Take(take)
            .ToListAsync();

        var map = mapper.Map<List<SingleNotificationDto>>(notifications);

        return new ResponseDto
        {
            StatusCode = StatusCodes.Status200OK,
            Success = true,
            Message = "Successfully get notifications",
            Data = map
        };
    }

    public async Task SendPostReactedNotificationAsync(
        string postId, string postOwnerId, ReactionType reaction)
    {
        var user = await FindUserAsync(postOwnerId);
        if(user == null)
        {
            return;
        }

        var payload = new PostReactedNotification
        {
            PostId = postId,
            ReactionType = reaction,
            ByUserId = currentUser.UserId,
            ByUserName = user.UserName,
            ByUserProfileImageUrl = user.ProfileImageUrl
        };

        var notification = new Entities.Notification
        {
            Title = $"{user.UserName} reacted to your post",
            UserId = postOwnerId,
            PayloadJson = JsonSerializer.Serialize(payload),
            Type = NotificationType.PostReacted,
            CreatedAt = DateTime.UtcNow
        };

        await context.Notifications.AddAsync(notification);
        await context.SaveChangesAsync();

        await hubContext.Clients
            .User(postOwnerId)
            .ReceiveNotification(new NotificationEnvelope
            {
                Title = notification.Title,
                CreatedAt = notification.CreatedAt,
                NotificationId = notification.Id,
                Type = notification.Type,
                Payload = payload
            });
    }

    public async Task SendCommentNotificationAsync(
        string postId,
        string commentId,
        string commentBody,
        string postOwnerId)
    {
        var user = await FindUserAsync(postOwnerId);
        if(user == null)
        {
            return;
        }

        var payload = new CommentAddedNotification
        {
            PostId = postId,
            CommentId = commentId,
            CommentBody = commentBody,
            ByUserId = currentUser.UserId,
            ByUserName = user.UserName,
            ByUserProfileImageUrl = user.ProfileImageUrl
        };

        var notification = new Entities.Notification
        {
            Title = $"{user.UserName} commented on your post",
            UserId = postOwnerId,
            PayloadJson = JsonSerializer.Serialize(payload),
            Type = NotificationType.CommentAdded,
            CreatedAt = DateTime.UtcNow
        };

        await context.Notifications.AddAsync(notification);
        await context.SaveChangesAsync();

        await hubContext.Clients
            .User(postOwnerId)
            .ReceiveNotification(new NotificationEnvelope
            {
                Title = notification.Title,
                NotificationId = notification.Id,
                Type = notification.Type,
                CreatedAt = notification.CreatedAt,
                Payload = payload
            });
    }

    public async Task SendFollowNotificationAsync(string followedUserId)
    {
        var user = await FindUserAsync(followedUserId);
        if(user == null)
        {
            return;
        }

        var payload = new FollowedNotification
        {
            ByUserId = currentUser.UserId,
            ByUserName = user.UserName,
            ByUserProfileImageUrl = user.ProfileImageUrl
        };

        var notification = new Entities.Notification
        {
            Title = $"{user.UserName} started following you",
            UserId = followedUserId,
            PayloadJson = JsonSerializer.Serialize(payload),
            Type = NotificationType.Followed,
            CreatedAt = DateTime.UtcNow
        };

        await context.Notifications.AddAsync(notification);
        await context.SaveChangesAsync();

        await hubContext.Clients
            .User(followedUserId)
            .ReceiveNotification(new NotificationEnvelope
            {
                Title = notification.Title,
                NotificationId = notification.Id,
                Type = notification.Type,
                CreatedAt = notification.CreatedAt,
                Payload = payload
            });
    }

    public async Task SendFollowRequestReceivedNotificationAsync(string requestedUserId)
    {
        var user = await FindUserAsync(requestedUserId);
        if(user == null)
        {
            return;
        }

        var payload = new FollowedNotification
        {
            ByUserId = currentUser.UserId,
            ByUserName = user.UserName,
            ByUserProfileImageUrl = user.ProfileImageUrl
        };

        var notification = new Entities.Notification
        {
            Title = $"{user.UserName} sent you a follow request",
            UserId = requestedUserId,
            PayloadJson = JsonSerializer.Serialize(payload),
            Type = NotificationType.FollowRequestReceived,
            CreatedAt = DateTime.UtcNow
        };

        await context.Notifications.AddAsync(notification);
        await context.SaveChangesAsync();

        await hubContext.Clients
            .User(requestedUserId)
            .ReceiveNotification(new NotificationEnvelope
            {
                Title = notification.Title,
                NotificationId = notification.Id,
                Type = notification.Type,
                CreatedAt = notification.CreatedAt,
                Payload = payload
            });
    }

    public async Task SendFollowRequestAcceptedNotificationAsync(string requesterUserId)
    {
        var user = await FindUserAsync(requesterUserId);
        if(user == null)
        {
            return;
        }

        var payload = new FollowedNotification
        {
            ByUserId = currentUser.UserId,
            ByUserName = user.UserName,
            ByUserProfileImageUrl = user.ProfileImageUrl
        };

        var notification = new Entities.Notification
        {
            Title = $"{user.UserName} accepted your follow request",
            UserId = requesterUserId,
            PayloadJson = JsonSerializer.Serialize(payload),
            Type = NotificationType.FollowRequestAccepted,
            CreatedAt = DateTime.UtcNow
        };

        await context.Notifications.AddAsync(notification);
        await context.SaveChangesAsync();

        await hubContext.Clients
            .User(requesterUserId)
            .ReceiveNotification(new NotificationEnvelope
            {
                Title = notification.Title,
                NotificationId = notification.Id,
                Type = notification.Type,
                CreatedAt = notification.CreatedAt,
                Payload = payload
            });
    }

    public async Task<ResponseDto> ReadNotificationsAsync(string notificationId)
    {
        var notificaton = await context.Notifications
            .FirstOrDefaultAsync(notification =>
                notification.Id == notificationId &&
                !notification.IsRead &&
                notification.UserId == currentUser.UserId);

        if(notificaton == null)
        {
            throw new NotFoundException("Notification", notificationId);
        }

        notificaton.IsRead = true;
        await context.SaveChangesAsync();

        return new ResponseDto
        {
            StatusCode = StatusCodes.Status200OK,
            Success = true,
            Message = "Notification read"
        };
    }

    public async Task<ResponseDto> ReadAllNotificationsAsync()
    {
        var notifications = await context.Notifications
            .Where(notification =>
                !notification.IsRead &&
                notification.UserId == currentUser.UserId)
            .ToListAsync();

        foreach (var notification in notifications)
            notification.IsRead = true;

        await context.SaveChangesAsync();

        return new ResponseDto
        {
            StatusCode = StatusCodes.Status200OK,
            Success = true,
            Message = "All notification read"
        };
    }

    private async Task<UserPreviewDto?> FindUserAsync(string targetUserId)
    {
        var userId = currentUser.UserId;
        if(string.IsNullOrEmpty(userId) || userId == targetUserId)
        {
            return null;
        }

        var user = await context.Users
            .Where(x => x.Id == userId)
            .Select(x => new UserPreviewDto
            {
                UserName = x.UserName ?? "UserName",
                ProfileImageUrl = x.ProfilePhotoPath
            })
            .FirstOrDefaultAsync();
        if(user == null)
        {
            return null;
        }

        return user;
    }
}