namespace Hukaa.Persistence.Extensions;

public static class ServiceCollectionExtensions
{
    extension(IServiceCollection services)
    {
        public void AddPersistenceServiceCollection(IConfiguration configuration)
        {
            services.AddServicesCollection(configuration);
            services.AddRepositoriesCollection(configuration);
        }


        private void AddRepositoriesCollection(IConfiguration configuration)
        {
            services.AddWriteRepositoriesCollection(configuration);
            services.AddReadRepositoriesCollection(configuration);
        }

        private void AddWriteRepositoriesCollection(IConfiguration configuration)
        {
        }

        private void AddReadRepositoriesCollection(IConfiguration configuration)
        {
        }

        private void AddServicesCollection(IConfiguration configuration)
        {
        }

        private void AddSqlServer(IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            });
        }
    }
}