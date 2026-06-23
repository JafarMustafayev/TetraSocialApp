namespace Tetra.Persistence.Context;

public class AppDbContext(DbContextOptions options) : IdentityDbContext<User, Role, string>(options)
{
    public DbSet<UserPreferences> UserPreferences { get; set; }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(typeof(UserConfiguration).Assembly);
    }
};