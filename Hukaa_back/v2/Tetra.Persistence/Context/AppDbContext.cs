using Tetra.Persistence.Configurations;

namespace Tetra.Persistence.Context;

public class AppDbContext(DbContextOptions options) : IdentityDbContext<User, Role, string>(options)
{
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(typeof(UserConfiguration).Assembly);
    }
};