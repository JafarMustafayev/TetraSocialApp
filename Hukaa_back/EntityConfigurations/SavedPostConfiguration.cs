namespace Hukaa_back.EntityConfigurations;

public class SavedPostConfiguration : IEntityTypeConfiguration<SavedPost>
{
    public void Configure(EntityTypeBuilder<SavedPost> builder)
    {
        builder.ToTable("SavedPosts");

        builder.HasKey(x => x.Id);

        // AppUser → Reaction
        builder.HasOne(x => x.AppUser)
            .WithMany(x => x.SavedPosts)
            .HasForeignKey(x => x.AppUserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Post → Reaction
        builder.HasOne(x => x.Post)
            .WithMany(x => x.SavedPosts)
            .HasForeignKey(x => x.PostId)
            .OnDelete(DeleteBehavior.NoAction);

        // Eyni user eyni postu 1 dəfə save ede bilsin
        builder.HasIndex(x => new { x.AppUserId, x.PostId })
            .IsUnique();
    }
}