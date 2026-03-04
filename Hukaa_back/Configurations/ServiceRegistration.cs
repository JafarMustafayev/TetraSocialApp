namespace Hukaa_back.Configurations;

public static class ServiceRegistration
{
    public static void ConfigurationServiceCollections(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSignalR();

        services.AddHttpContextAccessor();
        services.ConnectionSqlServer(configuration);
        services.ConfigureIdentity();
        services.AddServices(configuration);
        services.AddFluentValidator();
        services.AddAutoMapper(typeof(ProfileMapping).Assembly);
        services.AddAuthhorization();
        services.AddJwtAuthentication(configuration);
        services.AddCorsPolicy();
    }

    private static void ConnectionSqlServer(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
    }

    private static void AddServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<IAppConfig, AppConfig>();

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IRegistrationService, RegistrationService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IAccountRecoveryService, AccountRecoveryService>();
        services.AddScoped<IEmailSenderService, EmailSenderService>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IPostService, PostService>();
        services.AddScoped<IProfileService, ProfileService>();
        services.AddScoped<IExperienceService, ExperienceService>();
        services.AddScoped<IFileService, FileService>();
        services.AddScoped<IAccountManagementService, AccountManagementService>();
        services.AddScoped<IReactionService, ReactionService>();
        services.AddScoped<ICommentService, CommentService>();
        services.AddScoped<IFollowService, FollowService>();

        //realtime
        services.AddSingleton<IOnlineUserTracker, OnlineUserTracker>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<IConversationService, ConversationService>();
    }

    private static void ConfigureIdentity(this IServiceCollection services)
    {
        services.AddIdentity<AppUser, IdentityRole>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequiredLength = 6;

                options.User.RequireUniqueEmail = true;
                options.User.AllowedUserNameCharacters =
                    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._";

                options.SignIn.RequireConfirmedEmail = true;
                options.SignIn.RequireConfirmedAccount = false;

                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
                options.Lockout.MaxFailedAccessAttempts = 5;
            })
            .AddEntityFrameworkStores<AppDbContext>()
            .AddRoles<IdentityRole>()
            .AddSignInManager<SignInManager<AppUser>>()
            .AddDefaultTokenProviders();
    }

    private static void AddFluentValidator(this IServiceCollection services)
    {
        services.AddFluentValidationAutoValidation();
        services.AddFluentValidationClientsideAdapters();
        services.AddValidatorsFromAssembly(typeof(RegisterRequestDtoValidator).Assembly);

        services.Configure<ApiBehaviorOptions>(options =>
        {
            options.InvalidModelStateResponseFactory = context =>
            {
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status400BadRequest,
                    Title = "Validation failed" // default title əvəzinə
                };

                var response = new
                {
                    success = false,
                    statusCode = problemDetails.Status,
                    message = problemDetails.Title,
                    errors = problemDetails.Errors
                };

                return new BadRequestObjectResult(response);
            };
        });
    }

    private static void AddAuthhorization(this IServiceCollection services)
    {
        services.AddAuthorization(opt =>
        {
            opt.DefaultPolicy = new AuthorizationPolicyBuilder(JwtBearerDefaults.AuthenticationScheme)
                .RequireAuthenticatedUser()
                .Build();
        });
    }

    private static void AddJwtAuthentication(this IServiceCollection services, IConfiguration config)
    {
        var tokenParameters = config.GetSection("TokenParameters").Get<TokenParameters>();

        services.AddAuthentication(opt =>
            {
                opt.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(opt =>
            {
                opt.SaveToken = true;
                opt.RequireHttpsMetadata = false;

                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = true,
                    ValidateIssuer = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,

                    IssuerSigningKey =
                        new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(tokenParameters?.Signing?.Key ?? "SymmetricSecurityKey")),
                    ValidIssuer = tokenParameters?.Jwt?.Issuer ?? "ValidIssuer",
                    ValidAudience = tokenParameters?.Jwt?.Audience ?? "ValidAudience",

                    LifetimeValidator = (before, expires, token, param) =>
                    {
                        var now = DateTime.UtcNow;
                        var timeValidationResult = expires > now;
                        return timeValidationResult;
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

    private static void AddCorsPolicy(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("CorsPolicy", policy =>
            {
                policy.WithOrigins(new[]
                    {
                        "http://192.168.1.67:5173",
                        "http://192.168.1.90:5173",
                        "http://localhost:5173"
                    })
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });
    }
}