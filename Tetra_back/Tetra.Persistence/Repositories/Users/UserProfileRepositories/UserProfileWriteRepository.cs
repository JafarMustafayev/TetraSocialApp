namespace Tetra.Persistence.Repositories.Users.UserProfileRepositories;

public class UserProfileWriteRepository(AppDbContext context) :
    WriteRepository<UserProfile>(context), IUserProfileWriteRepository
{
}