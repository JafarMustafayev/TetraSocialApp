namespace Hukaa_back.Services.Auth;

public class TokenService(
    IAppConfig config,
    UserManager<AppUser> userManager) : ITokenService
{
    private readonly TokenParameters _tokenParameters = config.GetSection<TokenParameters>();

    public async Task<AccessTokenResponse> GenerateAccessToken(string userId)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_tokenParameters.Signing.Key));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var user = await userManager.FindByIdAsync(userId);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.UniqueName, user.UserName ?? "UserName"),
            new(JwtRegisteredClaimNames.Sub, userId),
            new(ClaimTypes.NameIdentifier, userId),

            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Iat,
                DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),
                ClaimValueTypes.Integer64),
            new(ClaimTypes.Role, UserRoles.User.ToString())
        };

        var userRoles = await userManager.GetRolesAsync(user);
        claims.AddRange(userRoles.Select(role => new Claim(ClaimTypes.Role, role)));

        var token = new JwtSecurityToken(
            _tokenParameters.Jwt.Issuer,
            _tokenParameters.Jwt.Audience,
            claims,
            DateTime.UtcNow,
            DateTime.UtcNow.AddMinutes(
                _tokenParameters.Expiration.AccessToken.TotalMinutes),
            creds);

        var handler = new JwtSecurityTokenHandler();

        return new AccessTokenResponse
        {
            TokenType = "Bearer",
            AccessToken = handler.WriteToken(token),
            AccessTokenExpiresAt = token.ValidTo
        };
    }
}