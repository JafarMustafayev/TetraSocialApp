namespace Tetra.Persistence.Extensions;

public static class ServiceCollectionExtensions
{
    extension(IServiceCollection services)
    {
        public void AddPersistenceServiceCollection(IConfiguration configuration)
        {
            services.AddSqlServer();
            services.AddRepositoriesCollection();
            services.AddIdentityParameters();
        }

        private void AddRepositoriesCollection()
        {
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddWriteRepositoriesCollection();
            services.AddReadRepositoriesCollection();
        }

        private void AddWriteRepositoriesCollection()
        {
            services.AddScoped<IRefreshTokenWriteRepository, RefreshTokenWriteRepository>();
            services.AddScoped<IAuthSessionWriteRepository, AuthSessionWriteRepository>();
            services.AddScoped<IVerificationTokenWriteRepository, VerificationTokenWriteRepository>();
            services.AddScoped<ITwoFactorRecoveryCodeWriteRepository, TwoFactorRecoveryCodeWriteRepository>();
            services.AddScoped<IUserProfileWriteRepository, UserProfileWriteRepository>();
            services.AddScoped<IUserPreferencesWriteRepository, UserPreferencesWriteRepository>();
            services.AddScoped<IUserNotificationSettingsWriteRepository, UserNotificationSettingsWriteRepository>();
            services.AddScoped<IUserPrivacySettingsWriteRepository, UserPrivacySettingsWriteRepository>();
        }

        private void AddReadRepositoriesCollection()
        {
            services.AddScoped<IRefreshTokenReadRepository, RefreshTokenReadRepository>();
            services.AddScoped<IAuthSessionReadRepository, AuthSessionReadRepository>();
            services.AddScoped<IVerificationTokenReadRepository, VerificationTokenReadRepository>();
            services.AddScoped<ITwoFactorRecoveryCodeReadRepository, TwoFactorRecoveryCodeReadRepository>();
            services.AddScoped<IUserProfileReadRepository, UserProfileReadRepository>();
            services.AddScoped<IUserPreferencesReadRepository, UserPreferencesReadRepository>();
            services.AddScoped<IUserNotificationSettingsReadRepository, UserNotificationSettingsReadRepository>();
            services.AddScoped<IUserPrivacySettingsReadRepository, UserPrivacySettingsReadRepository>();
        }

        private void AddSqlServer()
        {
            services.AddDbContext<AppDbContext>((sp, options) =>
            {
                var appConfig = sp.GetRequiredService<IAppConfig>();
                var connections = appConfig.GetSection<DatabaseOptions>();
                options.UseSqlServer(connections.SqlServerConnectionString);
            });
        }

        private void AddIdentityParameters()
        {
            var provider = services.BuildServiceProvider();
            var appConfig = provider.GetRequiredService<IAppConfig>();
            var identityOptions = appConfig.GetSection<IdentityOptions>();

            var tokenOptions = appConfig.GetSection<TokenOptions>();

            services.AddIdentity<User, Role>(options =>
                {
                    options.Password.RequireDigit = identityOptions.Password.RequireDigit;
                    options.Password.RequireLowercase = identityOptions.Password.RequireLowercase;
                    options.Password.RequireUppercase = identityOptions.Password.RequireUppercase;
                    options.Password.RequireNonAlphanumeric = identityOptions.Password.RequireNonAlphanumeric;
                    options.Password.RequiredLength = identityOptions.Password.RequiredLength;
                    options.Password.RequiredUniqueChars = identityOptions.Password.RequiredUniqueChars;

                    options.User.RequireUniqueEmail = identityOptions.User.RequireUniqueEmail;
                    options.User.AllowedUserNameCharacters = identityOptions.User.AllowedUserNameCharacters;

                    options.SignIn.RequireConfirmedEmail = identityOptions.SignIn.RequireConfirmedEmail;
                    options.SignIn.RequireConfirmedAccount = identityOptions.SignIn.RequireConfirmedAccount;
                    options.SignIn.RequireConfirmedPhoneNumber = identityOptions.SignIn.RequireConfirmedPhoneNumber;

                    options.Lockout.DefaultLockoutTimeSpan = identityOptions.Lockout.DefaultLockoutTimeSpan;
                    options.Lockout.MaxFailedAccessAttempts = identityOptions.Lockout.MaxFailedAccessAttempts;
                    options.Lockout.AllowedForNewUsers = identityOptions.Lockout.AllowedForNewUsers;
                })
                .AddRoles<Role>()
                .AddEntityFrameworkStores<AppDbContext>()
                .AddSignInManager<SignInManager<User>>()
                .AddRoleManager<RoleManager<Role>>()
                .AddDefaultTokenProviders();
        }
    }
}