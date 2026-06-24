namespace Tetra.Persistence.Repositories.Users.UserNotificationSettingsRepositories;

public class UserNotificationSettingsWriteRepository(AppDbContext context)
    : WriteRepository<UserNotificationSettings>(context), IUserNotificationSettingsWriteRepository
{
}