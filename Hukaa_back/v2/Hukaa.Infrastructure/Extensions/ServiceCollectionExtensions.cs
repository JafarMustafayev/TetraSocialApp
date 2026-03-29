namespace Hukaa.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    extension(IServiceCollection services)
    {
        public void AddInfrastructureServiceCollection(IConfiguration configuration)
        {
            services.AddServicesCollection(configuration);
        }

        private void AddServicesCollection(IConfiguration configuration)
        {
            services.AddSingleton<IAppConfig, AppConfig>();
            services.AddScoped<ILocalizationService, LocalizationService>();
            services.AddScoped<IAuthService, AuthService>();
        }
    }
}