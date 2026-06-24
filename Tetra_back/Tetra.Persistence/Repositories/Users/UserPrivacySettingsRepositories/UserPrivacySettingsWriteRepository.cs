namespace Tetra.Persistence.Repositories.Users.UserPrivacySettingsRepositories;

public class UserPrivacySettingsWriteRepository(AppDbContext context)
    : WriteRepository<UserPrivacySettings>(context), IUserPrivacySettingsWriteRepository
{
}