namespace Hukaa_back.ConfigurationModels;

public class TokenParameters
{
    public JwtOptions Jwt { get; set; } = new();
    public SigningOptions Signing { get; set; } = new();
    public TokenExpirationOptions Expiration { get; set; } = new();
    public TokenBehaviorOptions Behavior { get; set; } = new();
}

public class JwtOptions
{
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public TimeSpan ClockSkew { get; set; }
}

public class SigningOptions
{
    public string Key { get; set; } = string.Empty;
    public string Algorithm { get; set; } = "HS256";
}

public class TokenExpirationOptions
{
    public TimeSpan AccessToken { get; set; }
    public TimeSpan ConfirmationToken { get; set; }
}

public class TokenBehaviorOptions
{
    public bool ValidateIssuer { get; set; }
    public bool ValidateAudience { get; set; }
}
