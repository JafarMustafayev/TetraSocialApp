namespace Hukaa_back.EntityConfigurations;

public class MessageConfiguration : IEntityTypeConfiguration<Message>
{
    public void Configure(EntityTypeBuilder<Message> builder)
    {
        builder.ToTable("Messages");

        builder.HasKey(x => x.Id);

        // Properties
        builder.Property(x => x.ConversationId)
            .IsRequired()
            .HasMaxLength(450);

        builder.Property(x => x.SenderId)
            .IsRequired()
            .HasMaxLength(450);

        builder.Property(x => x.Content)
            .HasMaxLength(2000);

        builder.Property(x => x.PostId)
            .HasMaxLength(450);

        builder.Property(x => x.IsRead)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(x => x.MessageType)
            .IsRequired()
            .HasConversion<int>();

        // Relationships

        builder.HasOne(x => x.Conversation)
            .WithMany(c => c.Messages)
            .HasForeignKey(x => x.ConversationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Sender)
            .WithMany(u => u.Messages)
            .HasForeignKey(x => x.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Post)
            .WithMany()
            .HasForeignKey(x => x.PostId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}