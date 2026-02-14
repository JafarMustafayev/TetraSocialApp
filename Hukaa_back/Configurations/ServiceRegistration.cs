namespace Hukaa_back.Configurations;

public static class ServiceRegistration
{
    public static void ConfigurationServiceCollections(this IServiceCollection services,IConfiguration configuration)
    {
        services.ConnectionSqlServer(configuration);
    }

    private static void ConnectionSqlServer(this IServiceCollection services,IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
    }
}
