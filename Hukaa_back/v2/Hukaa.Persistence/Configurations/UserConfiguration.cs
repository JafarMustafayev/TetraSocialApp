namespace Hukaa.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.FirstName)
            .IsRequired(false)
            .HasMaxLength(100);

        builder.Property(x => x.LastName)
            .IsRequired(false)
            .HasMaxLength(100);

        builder.Property(x => x.Email)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(x => x.UserName)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(x => x.PreferredLanguage)
            .IsRequired()
            .HasMaxLength(10)
            .HasDefaultValue("en");

        builder.Property(x => x.Status)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.HasIndex(x => new
            {
                x.Id
            }).IsUnique()
            .HasName("IdIndex");

        builder.HasIndex(x => new
            {
                x.Email
            }).IsUnique()
            .HasName("EmailIndex");

        builder.HasIndex(x => new
            {
                x.UserName
            }).IsUnique()
            .HasName("UserNameIndex");

        builder.HasIndex(x => new
            {
                x.NormalizedEmail
            }).IsUnique()
            .HasName("NormalizedEmailIndex");

        builder.HasIndex(x => new
            {
                x.NormalizedUserName
            }).IsUnique()
            .HasName("NormalizedUserNameIndex");
    }
}