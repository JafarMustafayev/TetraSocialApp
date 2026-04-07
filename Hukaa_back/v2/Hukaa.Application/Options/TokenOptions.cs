namespace Hukaa.Application.Options;

public class TokenOptions
{
    public JwtOptions Jwt { get; init; } = new();
    public string SecurityKey { get; init; } = string.Empty;
    public TokenLifetimeOptions Lifetime { get; init; } = new();
    public TokenValidationOptions Validation { get; init; } = new();
    public RefreshTokenOptions RefreshToken { get; init; } = new();
}

public class JwtOptions
{
    public string Issuer { get; init; } = string.Empty;
    public string Audience { get; init; } = string.Empty;
    public TimeSpan ClockSkew { get; init; } = TimeSpan.FromMinutes(1);
}

public class TokenLifetimeOptions
{
    public TimeSpan AccessToken { get; init; } = TimeSpan.FromMinutes(15);
    public TimeSpan RefreshToken { get; init; } = TimeSpan.FromDays(7);
    public TimeSpan ConfirmationToken { get; init; } = TimeSpan.FromHours(24);
}

public class TokenValidationOptions
{
    public bool ValidateIssuer { get; init; } = true;
    public bool ValidateAudience { get; init; } = true;
    public bool ValidateLifetime { get; init; } = true;
    public bool ValidateSigningKey { get; init; } = true;
}

public class RefreshTokenOptions
{
    public bool RotateOnUse { get; init; } = true;
    public bool RevokeOnReuse { get; init; } = true;
}