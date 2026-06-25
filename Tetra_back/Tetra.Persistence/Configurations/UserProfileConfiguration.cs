namespace Tetra.Persistence.Configurations;

public class UserProfileConfiguration : IEntityTypeConfiguration<UserProfile>
{
    public void Configure(EntityTypeBuilder<UserProfile> builder)
    {
        builder.Property(x => x.FirstName)
            .IsRequired(false)
            .HasMaxLength(100);

        builder.Property(x => x.LastName)
            .IsRequired(false)
            .HasMaxLength(100);

        builder.Property(x => x.Birthday)
            .IsRequired();

        builder.Property(x => x.Gender)
            .IsRequired(false);

        builder.Property(x => x.ProfileImageUrl)
            .IsRequired(false)
            .HasMaxLength(200);

        builder.Property(x => x.CoverImageUrl)
            .IsRequired(false)
            .HasMaxLength(200);

        builder.Property(x => x.Bio)
            .IsRequired(false)
            .HasMaxLength(500);

        builder.Property(x => x.Website)
            .IsRequired(false)
            .HasMaxLength(500);

        builder.HasOne(x => x.User)
            .WithOne(x => x.Profile)
            .HasForeignKey<UserProfile>(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}