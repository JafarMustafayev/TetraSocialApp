namespace Hukaa.Application.Options.Token;

public class JwtOptions
{
    public string Issuer { get; init; } = string.Empty;
    public string Audience { get; init; } = string.Empty;
    public TimeSpan ClockSkew { get; init; } = TimeSpan.FromMinutes(1);
}