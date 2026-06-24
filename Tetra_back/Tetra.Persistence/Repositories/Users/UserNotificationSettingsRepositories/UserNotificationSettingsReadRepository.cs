namespace Tetra.Persistence.Repositories.Users.UserNotificationSettingsRepositories;

public class UserNotificationSettingsReadRepository(AppDbContext context)
    : ReadRepository<UserNotificationSettings>(context), IUserNotificationSettingsReadRepository
{
}