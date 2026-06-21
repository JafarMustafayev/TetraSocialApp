namespace Hukaa_back.EntityConfigurations;

public class FollowConfiguration : IEntityTypeConfiguration<Follow>
{
    public void Configure(EntityTypeBuilder<Follow> builder)
    {
        builder.ToTable("Follows");

        builder.HasKey(f => new { f.FollowerId, f.FollowingId });

        builder.Property(f => f.Status)
            .IsRequired()
            .HasConversion<int>();

        builder.HasOne(f => f.Follower)
            .WithMany(u => u.Following)
            .HasForeignKey(f => f.FollowerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(f => f.Following)
            .WithMany(u => u.Followers)
            .HasForeignKey(f => f.FollowingId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(f => f.FollowerId)
            .IsRequired();

        builder.Property(f => f.FollowingId)
            .IsRequired();
    }
}