namespace Hukaa_back.EntityConfigurations;

public class ReactionConfiguration : IEntityTypeConfiguration<Reaction>
{
    public void Configure(EntityTypeBuilder<Reaction> builder)
    {
        builder.ToTable("Reactions");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.ReactionType)
               .IsRequired();

        // AppUser → Reaction
        builder.HasOne(x => x.AppUser)
               .WithMany(x => x.Reactions)
               .HasForeignKey(x => x.AppUserId)
               .OnDelete(DeleteBehavior.Cascade);

        // Post → Reaction
        builder.HasOne(x => x.Post)
               .WithMany(x => x.Reactions)
               .HasForeignKey(x => x.PostId)
               .OnDelete(DeleteBehavior.NoAction);

        // Eyni user eyni posta 1 dəfə reaction verə bilsin
        builder.HasIndex(x => new { x.AppUserId, x.PostId })
               .IsUnique();
    }
}
