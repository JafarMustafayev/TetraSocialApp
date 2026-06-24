namespace Tetra.Persistence.Configurations;

public class UserPreferencesConfiguration : IEntityTypeConfiguration<UserPreferences>
{
    public void Configure(EntityTypeBuilder<UserPreferences> builder)
    {
        builder.Property(x => x.AccentHue)
            .IsRequired()
            .HasDefaultValue(200);

        builder.Property(x => x.Language)
            .IsRequired(false)
            .HasDefaultValue(Languages.En);

        builder.Property(x => x.Theme)
            .IsRequired(false)
            .HasDefaultValue(Theme.System);

        builder.HasOne(x => x.User)
            .WithOne(x => x.Preferences)
            .HasForeignKey<UserPreferences>(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}