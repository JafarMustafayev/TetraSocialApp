namespace Hukaa_back.Data;

public class AppDbContext : IdentityDbContext<AppUser, IdentityRole, string>
{
    public AppDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<Post> Posts { get; set; }
    public DbSet<PostFile> PostFiles { get; set; }
    public DbSet<Reaction> Reactions { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Follow> Follows { get; set; }
    public DbSet<SavedPost> SavedPosts { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<WorkExperience> WorkExperiences { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(PostConfiguration).Assembly);

        ModelBuilderExtensions.ApplySoftDeleteFilterIfExists(modelBuilder);
    }
}