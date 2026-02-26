namespace Hukaa_back.EntityConfigurations;

public class PostConfiguration : IEntityTypeConfiguration<Post>
{
    public void Configure(EntityTypeBuilder<Post> builder)
    {
        builder.ToTable("Posts");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Content)
            .IsRequired(false)
            .HasMaxLength(1000);

        builder.Property(x => x.IsArchived)
            .HasDefaultValue(false);

        builder.Property(x => x.IsDeleted)
            .HasDefaultValue(false);

        builder.Property(x => x.ShareCounter)
            .HasDefaultValue(0);

        // AppUser → Post (One-to-Many)
        builder.HasOne(x => x.AppUser)
            .WithMany(x => x.Posts)
            .HasForeignKey(x => x.AppUserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Post → Reactions (One-to-Many)
        builder.HasMany(x => x.Reactions)
            .WithOne(x => x.Post)
            .HasForeignKey(x => x.PostId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}