using TokenOptions = Hukaa.Application.Options.TokenOptions;

namespace Hukaa.Infrastructure.Services.Auth;

public class TokenService(
    IAppConfig config,
    IRefreshTokenHasher hasher,
    IRefreshTokenReadRepository readRepo,
    IRefreshTokenWriteRepository writeRepo,
    IUnitOfWork unitOfWork) : ITokenService
{
    private readonly TokenOptions _tokenOptions = config.GetSection<TokenOptions>();

    public async Task<RefreshTokenResponse> GenerateRefreshTokenAsync(string userId)
    {
        var plainToken = GeneratePlainToken();
        var hash = HashRefreshToken(plainToken);

        var entity = CreateRefreshToken(hash, userId);
        await writeRepo.AddAsync(entity);
        await unitOfWork.SaveChangesAsync();

        return new RefreshTokenResponse
        {
            RefreshToken = plainToken,
            RefreshTokenExpiresAt = entity.ExpiresAt
        };
    }

    public AccessTokenResponse GenerateAccessToken(string userId, IList<string> roles)
    {
        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_tokenOptions.SecurityKey));

        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId),

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

    private RefreshToken CreateRefreshToken(string token, string userId)
    {
        return new RefreshToken
        {
            //UserId = userId,
            CreatedByIp = "127.0.0.1", //todo: IP elde etmek ucun servis yazildiqdan sonra burada deyisiklik edilecek.
            TokenHash = token,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddMinutes(
                _tokenOptions.Lifetime.RefreshToken.TotalMinutes)
        };
    }
}