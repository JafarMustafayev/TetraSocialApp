namespace Hukaa.Application.Options.Token;

public class TokenLifetimeOptions
{
    public TimeSpan AccessToken { get; init; } = TimeSpan.FromMinutes(15);
    public TimeSpan RefreshToken { get; init; } = TimeSpan.FromDays(7);
    public TimeSpan ConfirmationToken { get; init; } = TimeSpan.FromHours(24);
}