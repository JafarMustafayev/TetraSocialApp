namespace Hukaa.Infrastructure.Options;

public class IdentityConfigOptions
{
    public PasswordOptions Password { get; set; } = new();
    public UserOptions User { get; set; } = new();
    public SignInOptions SignIn { get; set; } = new();
    public LockoutOptions Lockout { get; set; } = new();
}

public class PasswordOptions
{
    public bool RequireDigit { get; set; } = false;
    public bool RequireLowercase { get; set; } = false;
    public bool RequireUppercase { get; set; } = false;
    public bool RequireNonAlphanumeric { get; set; } = false;
    public int RequiredLength { get; set; } = 6;
    public int RequiredUniqueChars { get; set; } = 0;
}

public class UserOptions
{
    public bool RequireUniqueEmail { get; set; } = true;

    public string AllowedUserNameCharacters { get; set; } =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._";
}

public class SignInOptions
{
    public bool RequireConfirmedEmail { get; set; } = true;
    public bool RequireConfirmedAccount { get; set; } = false;
    public bool RequireConfirmedPhoneNumber { get; set; } = false;
}

public class LockoutOptions
{
    public TimeSpan DefaultLockoutTimeSpan { get; set; } = TimeSpan.FromMinutes(15);
    public int MaxFailedAccessAttempts { get; set; } = 5;
    public bool AllowedForNewUsers { get; set; } = true;
}