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
            services.AddScoped<IJwtClaimsReader, JwtClaimsReader>();
            services.AddScoped<ILocalizationService, LocalizationService>();
            services.AddScoped<ITokenHasher, TokenHasher>();
            services.AddScoped<IUserAgentParser, UserAgentParser>();
            services.AddSingleton<IAppConfig, AppConfig>();

            //Account
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IEmailVerificationService, EmailVerificationService>();
            services.AddScoped<IPasswordManagementService, PasswordManagementService>();

            //Auth
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ISessionService, SessionService>();
            services.AddScoped<IAuthTokenService, AuthTokenService>();
            services.AddScoped<ITwoFactorService, TwoFactorService>();
            services.AddScoped<IVerificationTokenService, VerificationTokenService>();

            //Profile
            services.AddScoped<IProfileService, ProfileService>();

            //Mail
            services.AddScoped<IMailSender, MailSender>();
            services.AddScoped<IMailService, MailService>();
        }
    }
}