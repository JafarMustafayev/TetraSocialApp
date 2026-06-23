namespace Tetra.Persistence.Configurations;

public class TwoFactorRecoveryCodeConfiguration : IEntityTypeConfiguration<TwoFactorRecoveryCode>
{
    public void Configure(EntityTypeBuilder<TwoFactorRecoveryCode> builder)
    {
        builder.ToTable("TwoFactorRecoveryCodes");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.UserId)
            .IsRequired();

        builder.Property(x => x.CodeHash)
            .IsRequired()
            .HasMaxLength(512);

        builder.Property(x => x.IsUsed)
            .HasDefaultValue(false)
            .IsRequired();

        builder.Property(x => x.UsedAt)
            .IsRequired(false);

        builder.HasIndex(x => x.UserId);

        builder.HasIndex(x => new { x.UserId, x.CodeHash })
            .IsUnique();

        builder.HasOne(x => x.User)
            .WithMany(x => x.TwoFactorRecoveryCodes)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}