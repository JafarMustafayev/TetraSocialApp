using TokenOptions = Hukaa.Application.Options.TokenOptions;

namespace Hukaa.Infrastructure.Services.Auth;

public class TokenService(
    IAppConfig config,
    IRefreshTokenHasher hasher,
    IRefreshTokenReadRepository readRepo,
    IRefreshTokenWriteRepository writeRepo,
    IUnitOfWork unitOfWork,
    IClientIpResolver ipResolver) : ITokenService
{
    private readonly TokenOptions _tokenOptions = config.GetSection<TokenOptions>();

    public async Task<RefreshTokenResponse> GenerateRefreshTokenAsync(string sessionId)
    {
        var plainToken = GeneratePlainToken();
        var hash = HashRefreshToken(plainToken);

        var entity = CreateRefreshToken(hash, sessionId);
        await writeRepo.AddAsync(entity);
        await unitOfWork.SaveChangesAsync();

        return new RefreshTokenResponse
        {
            RefreshToken = plainToken,
            RefreshTokenExpiresAt = entity.ExpiresAt
        };
    }

    public AccessTokenResponse GenerateAccessToken(
        string userId,
        string sessionId,
        IList<string> roles)
    {
        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_tokenOptions.SecurityKey));

        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId),
            new("sessionId", sessionId),

            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Iat,
                DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),
                ClaimValueTypes.Integer64)
        };

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var token = new JwtSecurityToken(
            _tokenOptions.Jwt.Issuer,
            _tokenOptions.Jwt.Audience,
            claims,
            DateTime.UtcNow,
            DateTime.UtcNow
                .AddMinutes(_tokenOptions.Lifetime.AccessToken.TotalMinutes),
            credentials);
        var handler = new JwtSecurityTokenHandler();

        return new AccessTokenResponse
        {
            AccessToken = handler.WriteToken(token),
            AccessTokenExpiresAt = token.ValidTo
        };
    }

    private string GeneratePlainToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
    }

    private string HashRefreshToken(string token)
    {
        return hasher.Hash(token, _tokenOptions.SecurityKey);
    }

    private RefreshToken CreateRefreshToken(string token, string sessionId)
    {
        return new RefreshToken
        {
            AuthSessionId = sessionId,
            CreatedByIp = ipResolver.GetClientIpV4(),
            TokenHash = token,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddMinutes(
                _tokenOptions.Lifetime.RefreshToken.TotalMinutes)
        };
    }
}