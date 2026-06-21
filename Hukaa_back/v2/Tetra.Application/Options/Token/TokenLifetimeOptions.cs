namespace Tetra.Application.Options.Token;

public class TokenLifetimeOptions
{
    public TimeSpan AccessToken { get; init; } = TimeSpan.FromMinutes(15);
    public TimeSpan RefreshToken { get; init; } = TimeSpan.FromDays(7);
    public TimeSpan EmailConfirmationToken { get; init; } = TimeSpan.FromHours(1);
    public TimeSpan PasswordResetToken { get; init; } = TimeSpan.FromHours(1);
    public TimeSpan EmailChangeToken { get; init; } = TimeSpan.FromHours(1);
    public TimeSpan LoginVerificationToken { get; init; } = TimeSpan.FromMinutes(15);
    public TimeSpan TwoFactorVerificationToken { get; init; } = TimeSpan.FromMinutes(10);
}