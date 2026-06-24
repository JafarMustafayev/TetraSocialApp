namespace Tetra.Persistence.Repositories.Users.UserPreferencesRepositories;

public class UserPreferencesReadRepository(AppDbContext context)
    : ReadRepository<UserPreferences>(context), IUserPreferencesReadRepository
{
}