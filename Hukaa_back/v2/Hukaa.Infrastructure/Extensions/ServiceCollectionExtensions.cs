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
            services.AddScoped<IRefreshTokenHasher, RefreshTokenHasher>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<ISessionService, SessionService>();
            services.AddScoped<IClientIpResolver, ClientIpResolver>();
            services.AddScoped<IUserAgentParser, UserAgentParser>();
        }
    }
}