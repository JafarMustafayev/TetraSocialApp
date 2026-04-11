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
            services.AddCorsPolicy();
        }

        private void AddCorsPolicy()
        {
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", policy =>
                {
                    policy.WithOrigins(new[]
                        {
                            "http://localhost:5173"
                        })
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });
        }
    }
}