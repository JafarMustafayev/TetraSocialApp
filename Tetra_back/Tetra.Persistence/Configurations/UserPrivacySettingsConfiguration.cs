namespace Tetra.Persistence.Configurations;

public class UserPrivacySettingsConfiguration : IEntityTypeConfiguration<UserPrivacySettings>
{
    public void Configure(EntityTypeBuilder<UserPrivacySettings> builder)
    {
        builder.Property(x => x.MessagePermission)
            .HasDefaultValue(MessagePermission.Everyone)
            .IsRequired();

        builder.Property(x => x.LastSeenVisibility)
            .HasDefaultValue(LastSeenVisibility.Everyone)
            .IsRequired();

        builder.Property(x => x.ReadReceiptEnabled)
            .HasDefaultValue(true)
            .IsRequired();

        builder.Property(x => x.InvisibleBrowsingEnabled)
            .HasDefaultValue(false)
            .IsRequired();

        builder.Property(x => x.ActivityStatusEnabled)
            .HasDefaultValue(true)
            .IsRequired();

        builder.HasOne(x => x.User)
            .WithOne(x => x.PrivacySettings)
            .HasForeignKey<UserPrivacySettings>(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}