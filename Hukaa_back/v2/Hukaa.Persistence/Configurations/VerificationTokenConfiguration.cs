namespace Hukaa.Persistence.Configurations;

public class VerificationTokenConfiguration : IEntityTypeConfiguration<VerificationToken>
{
    public void Configure(EntityTypeBuilder<VerificationToken> builder)
    {
        builder.ToTable("VerificationTokens");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.TokenHash)
            .IsRequired();

        builder.Property(x => x.Purpose)
            .IsRequired();

        builder.Property(x => x.ExpiresAt)
            .IsRequired();

        builder.Property(x => x.Target)
            .IsRequired(false);

        builder.Property(x => x.CreatedByIp)
            .HasMaxLength(20)
            .IsRequired();

        // Usage
        builder.Property(x => x.IsUsed)
            .HasDefaultValue(false)
            .IsRequired();

        builder.Property(x => x.UsedAt)
            .IsRequired(false);

        builder.Property(x => x.UsedByIp)
            .HasMaxLength(20)
            .IsRequired(false);

        // Revocation
        builder.Property(x => x.IsRevoked)
            .HasDefaultValue(false)
            .IsRequired();

        builder.Property(x => x.RevokedAt)
            .IsRequired(false);

        builder.Property(x => x.RevokedByIp)
            .HasMaxLength(20)
            .IsRequired(false);

        builder.Property(x => x.RevocationReason)
            .IsRequired(false);

        // Replacement (self-reference)
        builder.Property(x => x.ReplacedByTokenId)
            .IsRequired(false);

        builder.HasOne(x => x.ReplacedByToken)
            .WithMany()
            .HasForeignKey(x => x.ReplacedByTokenId)
            .OnDelete(DeleteBehavior.Restrict);

        //Index
        builder.HasIndex(x => x.TokenHash)
            .IsUnique()
            .HasName("TokenHashIndex");

        builder.HasIndex(x => x.IsUsed)
            .HasName("IsUsedIndex");

        builder.HasIndex(x => x.IsRevoked)
            .HasName("IsRevokedIndex");

        builder.HasIndex(x => x.UserId)
            .HasName("UserIdIndex");

        // Ignore computed properties
        builder.Ignore(x => x.IsExpired);
        builder.Ignore(x => x.IsActive);
    }
}