namespace Hukaa.Persistence.Context;

public class AppDbContext(DbContextOptions options) : IdentityDbContext<User, Role, string>(options);