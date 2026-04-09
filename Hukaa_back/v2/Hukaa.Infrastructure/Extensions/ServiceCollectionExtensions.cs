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
            //Common
            services.AddScoped<IClientIpResolver, ClientIpResolver>();
            services.AddScoped<ILocalizationService, LocalizationService>();
            services.AddScoped<IRefreshTokenHasher, RefreshTokenHasher>();
            services.AddScoped<IUserAgentParser, UserAgentParser>();
            services.AddSingleton<IAppConfig, AppConfig>();

            //Account
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IEmailVerificationService, EmailVerificationService>();
            services.AddScoped<IPasswordManagementService, PasswordManagementService>();

            //Auth
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ISessionService, SessionService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<ITwoFactorService, TwoFactorService>();

            //Profile
            services.AddScoped<IProfileService, ProfileService>();
        }
    }
}