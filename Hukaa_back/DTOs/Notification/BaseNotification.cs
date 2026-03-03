namespace Hukaa_back.DTOs.Notification;

public record BaseNotification()
{
    public required string ByUserId { get; init; }
    public required string ByUserName { get; init; }
    public string? ByUserProfileImageUrl { get; init; }
};