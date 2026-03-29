namespace Hukaa.Persistence.Seed;

public static class RoleSeed
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        var roleManager = serviceProvider.GetRequiredService<RoleManager<Role>>();
        string[] roles =
        {
            UserRoles.User,
            UserRoles.Admin,
            UserRoles.Moderator
        };

        foreach (var role in roles)
            if(!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new Role { Name = role });
            }
    }
}