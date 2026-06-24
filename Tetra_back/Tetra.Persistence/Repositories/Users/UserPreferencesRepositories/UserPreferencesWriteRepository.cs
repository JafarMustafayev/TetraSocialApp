namespace Tetra.Persistence.Repositories.Users.UserPreferencesRepositories;

public class UserPreferencesWriteRepository(AppDbContext context)
    : WriteRepository<UserPreferences>(context), IUserPreferencesWriteRepository
{
}