namespace Tetra.Application.Options.Token;

public class TokenOptions
{
    public JwtOptions Jwt { get; init; } = new();
    public string SecurityKey { get; init; } = string.Empty;
    public TokenLifetimeOptions Lifetime { get; init; } = new();
    public TokenValidationOptions Validation { get; init; } = new();
    public RefreshTokenOptions RefreshToken { get; init; } = new();
}