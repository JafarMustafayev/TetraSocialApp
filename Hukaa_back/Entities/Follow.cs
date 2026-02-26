namespace Hukaa_back.Entities;

public class Follow : BaseEntity
{
    public string FollowerId { get; set; }
    public string FollowingId { get; set; }

    public FollowStatus Status { get; set; }

    public AppUser Follower { get; set; }
    public AppUser Following { get; set; }
}