namespace Hukaa_back.Realtime;

public sealed record PostReactedNotification : BaseNotification
{
    public required string PostId { get; init; }
    public required ReactionType ReactionType { get; init; }
}