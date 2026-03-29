namespace Hukaa.API.Extensions;

public static class ServiceCollectionExtensions
{
    extension(IServiceCollection services)
    {
        public void AppServiceCollections(IConfiguration configuration)
        {
            services.AddLocalization(options => { options.ResourcesPath = "Resources"; });
            services.AddControllers(options =>
            {
                options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true;
            }).AddDataAnnotationsLocalization();
            services.AddOpenApi();

            services.AddApplicationServiceCollection(configuration);
            services.AddInfrastructureServiceCollection(configuration);
            services.AddPersistenceServiceCollection(configuration);
        }
    }
}