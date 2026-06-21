namespace Tetra.Persistence.Configurations;

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.ToTable("RefreshTokens");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.TokenHash)
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.ExpiresAt)
            .IsRequired();

        builder.Property(x => x.CreatedByIp)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(x => x.IsUsed)
            .HasDefaultValue(false)
            .IsRequired();

        builder.Property(x => x.UsedAt)
            .IsRequired(false);

        builder.Property(x => x.ReplacedByTokenId)
            .IsRequired(false);

        builder.Property(x => x.ReplacedByIp)
            .IsRequired(false)
            .HasMaxLength(20);

        builder.Property(x => x.IsRevoked)
            .HasDefaultValue(false)
            .IsRequired();

        builder.Property(x => x.RevokedAt)
            .IsRequired(false);

        builder.Property(x => x.RevokedByIp)
            .IsRequired(false)
            .HasMaxLength(20);

        builder.HasIndex(x => x.TokenHash)
            .IsUnique()
            .HasName("TokenHashIndex");

        builder.HasIndex(x => x.IsUsed)
            .HasName("IsUsedIndex");

        builder.HasIndex(x => x.CreatedByIp)
            .HasName("CreatedByIpIndex");

        builder.HasIndex(x => x.Id)
            .HasName("IdIndex");

        builder.HasIndex(x => x.AuthSessionId)
            .HasName("UserIdIndex");
    }
}