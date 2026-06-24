namespace Tetra.Domain.Entities.Identities;

public class User : IdentityUser<string>
{
    public override string Id { get; set; } = Guid.NewGuid().ToString();

    public override string Email { get; set; } = string.Empty;
    public override string UserName { get; set; } = string.Empty;

    public UserStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }

    public string? AuthenticatorKey { get; set; }
    public TwoFactorProvider TwoFactorProvider { get; set; } = TwoFactorProvider.None;

    public HashSet<TwoFactorRecoveryCode> TwoFactorRecoveryCodes { get; set; } = new();
    public HashSet<AuthSession> AuthSessions { get; set; } = new();
    public HashSet<VerificationToken> VerificationTokens { get; set; } = new();

    public HashSet<UserNotificationSettings> NotificationSettings { get; set; } = new();
    public UserProfile Profile { get; set; } = new();
    public UserPreferences Preferences { get; set; } = new();
    public UserPrivacySettings PrivacySettings { get; set; } = new();
}