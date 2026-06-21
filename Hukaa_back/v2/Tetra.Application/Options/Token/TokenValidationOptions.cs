namespace Tetra.Application.Options.Token;

public class TokenValidationOptions
{
    public bool ValidateIssuer { get; init; } = true;
    public bool ValidateAudience { get; init; } = true;
    public bool ValidateLifetime { get; init; } = true;
    public bool ValidateSigningKey { get; init; } = true;
}