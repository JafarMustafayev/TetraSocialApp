namespace Tetra.Persistence.Repositories.Users.UserPrivacySettingsRepositories;

public class UserPrivacySettingsReadRepository(AppDbContext context)
    : ReadRepository<UserPrivacySettings>(context), IUserPrivacySettingsReadRepository
{
}