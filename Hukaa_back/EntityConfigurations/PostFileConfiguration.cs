namespace Hukaa_back.EntityConfigurations;

public class PostFileConfiguration : IEntityTypeConfiguration<PostFile>
{
    public void Configure(EntityTypeBuilder<PostFile> builder)
    {
        builder.ToTable("PostFiles");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.FileName)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(x => x.FileExtension)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(x => x.FilePath)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(x => x.FileType)
            .IsRequired()
            .HasConversion<int>(); // Enum -> int

        builder.Property(x => x.IsDeleted)
            .HasDefaultValue(false);

        builder.Property(x => x.DeletedAt)
            .HasColumnType("datetime2");

        builder.HasOne(x => x.Post)
            .WithMany(p => p.PostFiles)
            .HasForeignKey(x => x.PostId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
