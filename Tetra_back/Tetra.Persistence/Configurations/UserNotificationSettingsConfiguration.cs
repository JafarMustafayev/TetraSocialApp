namespace Tetra.Persistence.Configurations;

public class UserNotificationSettingsConfiguration : IEntityTypeConfiguration<UserNotificationSettings>
{
    public void Configure(EntityTypeBuilder<UserNotificationSettings> builder)
    {
        builder.Property(x => x.Type)
            .IsRequired();

        builder.Property(x => x.IsMailEnabled)
            .IsRequired();

        builder.Property(x => x.IsPushEnabled)
            .IsRequired();

        builder.HasOne(x => x.User)
            .WithMany(x => x.NotificationSettings)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => new { x.UserId, x.Type })
            .IsUnique();
    }
}