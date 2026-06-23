namespace Tetra.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Email)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(x => x.UserName)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(x => x.Status)
            .IsRequired()
            .HasDefaultValue(UserStatus.PendingVerification);

        builder.Property(x => x.TwoFactorProvider)
            .IsRequired()
            .HasDefaultValue(TwoFactorProvider.None);

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.HasIndex(x => x.Id)
            .IsUnique()
            .HasName("IdIndex");

        builder.HasIndex(x => x.Email)
            .IsUnique()
            .HasName("EmailIndex");

        builder.HasIndex(x => x.UserName)
            .IsUnique()
            .HasName("UserNameIndex");

        builder.HasIndex(x => x.NormalizedEmail)
            .IsUnique()
            .HasName("NormalizedEmailIndex");

        builder.HasIndex(x => x.NormalizedUserName)
            .IsUnique()
            .HasName("NormalizedUserNameIndex");
    }
}