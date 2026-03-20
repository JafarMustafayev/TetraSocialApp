namespace Hukaa.API.Extensions;

public static class ServiceCollectionExtensions
{
    extension(IServiceCollection services)
    {
        public void AppServiceCollections(IConfiguration configuration)
        {
            services.AddControllers();
            services.AddOpenApi();

            services.AddPersistenceServiceCollection(configuration);
        }
    }
}