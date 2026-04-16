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
            services.AddJwtAuthentication();
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

        private void AddJwtAuthentication()
        {
            services.AddAuthentication(opt =>
                {
                    opt.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer();

            services.AddOptions<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme)
                .Configure<IAppConfig>((opt, appConfig) =>
                {
                    var tokenOptions = appConfig.GetSection<TokenOptions>();

                    opt.SaveToken = true;
                    opt.RequireHttpsMetadata = false;

                    opt.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateAudience = true,
                        ValidateIssuer = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,

                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(tokenOptions.SecurityKey)),

                        ValidIssuer = tokenOptions.Jwt.Issuer,
                        ValidAudience = tokenOptions.Jwt.Audience,

                        LifetimeValidator = (before, expires, token, param) =>
                        {
                            var now = DateTime.UtcNow;
                            return expires > now;
                        }
                    };

                    opt.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];
                            var path = context.HttpContext.Request.Path;

                            if(!string.IsNullOrEmpty(accessToken) &&
                               path.StartsWithSegments("/hubs"))
                            {
                                context.Token = accessToken;
                            }

                            return Task.CompletedTask;
                        }
                    };
                });
        }
    }
}