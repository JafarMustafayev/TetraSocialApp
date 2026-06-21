namespace Tetra.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    extension(IServiceCollection services)
    {
        public void AddInfrastructureServiceCollection(IConfiguration configuration)
        {
            services.AddRedis();
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
            services.AddScoped<IRedisCacheService, RedisCacheService>();

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
            services.AddScoped<IAccountVerificationService, AccountVerificationService>();

            //Profile
            services.AddScoped<IProfileService, ProfileService>();

            //Mail
            services.AddScoped<IMailSender, MailSender>();
            services.AddScoped<IMailService, MailService>();

            //Client
            services.AddScoped<IClientUrlService, ClientUrlService>();
        }

        private void AddRedis()
        {
            services.AddSingleton<IConnectionMultiplexer>(sp =>
            {
                var appConfig = sp.GetRequiredService<IAppConfig>();
                var databaseOptions = appConfig.GetSection<DatabaseOptions>();

                if(string.IsNullOrWhiteSpace(databaseOptions.RedisConnectionString))
                {
                    throw new InvalidOperationException("Redis connection string is not configured.");
                }

                var options = ConfigurationOptions.Parse(databaseOptions.RedisConnectionString);

                options.AbortOnConnectFail = false;
                options.ConnectRetry = 5;
                options.ConnectTimeout = 5000;
                options.SyncTimeout = 5000;
                options.AsyncTimeout = 5000;
                options.KeepAlive = 60;
                options.ReconnectRetryPolicy = new ExponentialRetry(1000, 10000);
                options.ClientName = "Tetra.Api";

                var redis = ConnectionMultiplexer.Connect(options);

                return redis;
            });
        }

    }
}