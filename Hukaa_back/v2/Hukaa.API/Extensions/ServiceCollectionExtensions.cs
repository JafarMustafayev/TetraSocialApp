namespace Hukaa.API.Extensions;

public static class ServiceCollectionExtensions
{
    extension(IServiceCollection services)
    {
        public void AppServiceCollections(IConfiguration configuration)
        {
            services.AddLocalization(options => { options.ResourcesPath = "Resources"; });
            services.AddControllers().AddDataAnnotationsLocalization();
            services.AddOpenApi();

            services.AddInfrastructureServiceCollection(configuration);
            services.AddPersistenceServiceCollection(configuration);
        }
    }
}