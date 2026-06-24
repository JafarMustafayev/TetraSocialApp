namespace Tetra.Persistence.Repositories.Users.UserProfileRepositories;

public class UserProfileReadRepository(AppDbContext context)
    : ReadRepository<UserProfile>(context), IUserProfileReadRepository
{
}