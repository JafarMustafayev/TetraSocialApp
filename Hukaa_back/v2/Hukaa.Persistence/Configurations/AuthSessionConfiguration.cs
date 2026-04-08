namespace Hukaa.Persistence.Configurations;

public class AuthSessionConfiguration : IEntityTypeConfiguration<AuthSession>
{
    public void Configure(EntityTypeBuilder<AuthSession> builder)
    {
        builder.ToTable("AuthSessions");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.UserAgent)
            .IsRequired(false);

        builder.Property(x => x.DeviceInfo)
            .IsRequired(false);

        builder.Property(x => x.LocationInfo)
            .IsRequired(false);

        builder.Property(x => x.CreatedByIp)
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(x => x.LastActivityAt)
            .IsRequired(false);

        builder.Property(x => x.IsRevoked)
            .HasDefaultValue(false)
            .IsRequired();

        builder.Property(x => x.RevokedAt)
            .IsRequired(false);

        builder.Property(x => x.RevokedByIp)
            .HasMaxLength(20)
            .IsRequired(false);
    }
}