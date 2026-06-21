namespace Tetra.Infrastructure.Services.Auth;

public class AuthTokenService(
    IAppConfig config,
    ITokenHasher hasher,
    IRefreshTokenReadRepository readRepo,
    IRefreshTokenWriteRepository writeRepo,
    IUnitOfWork unitOfWork,
    IClientIpResolver ipResolver,
    IJwtClaimsReader claimsReader,
    ILocalizationService localizer) : IAuthTokenService
{
    private readonly TokenOptions _tokenOptions = config.GetSection<TokenOptions>();

    public async Task<RefreshTokenResponse> GenerateRefreshTokenAsync(string sessionId)
    {
        var (plainToken, entity) = await CreateRefreshTokenInternalAsync(sessionId);

        return new RefreshTokenResponse
        {
            RefreshToken = plainToken,
            RefreshTokenExpiresAt = entity.ExpiresAt
        };
    }

    public AccessTokenResponse GenerateAccessToken(string userId, string sessionId, IList<string> roles)
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

        claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

        var token = new JwtSecurityToken(
            _tokenOptions.Jwt.Issuer,
            _tokenOptions.Jwt.Audience,
            claims,
            DateTime.UtcNow,
            DateTime.UtcNow.AddMinutes(_tokenOptions.Lifetime.AccessToken.TotalMinutes),
            credentials);

        return new AccessTokenResponse
        {
            AccessToken = new JwtSecurityTokenHandler().WriteToken(token),
            AccessTokenExpiresAt = token.ValidTo
        };
    }

    public async Task<RefreshToken> ValidateRefreshTokenAsync(string refreshToken)
    {
        var token = await GetTokenAsync(refreshToken, true);

        if(token == null)
        {
            throw new NotFoundException(localizer.Get("Error.Token.Get.NotFound"));
        }

        if(!token.IsActive)
        {
            if(token.IsRevoked)
            {
                throw new BadRequestException(localizer.Get("Error.Token.Validate.Revoked"));
            }

            if(token.IsUsed)
            {
                throw new BadRequestException(localizer.Get("Error.Token.Validate.Used"));
            }

            if(token.IsExpired)
            {
                throw new BadRequestException(localizer.Get("Error.Token.Validate.Expired"));
            }

            throw new BadRequestException(localizer.Get("Error.Token.Validate.Invalid"));
        }

        return token;
    }

    public async Task RevokeRefreshTokenAsync(string refreshToken)
    {
        var token = await GetTokenAsync(refreshToken, true);
        if(token == null)
        {
            throw new NotFoundException(localizer.Get("Error.Token.Get.NotFound"));
        }

        token.Revoke(ipResolver.GetClientIpV4());
        writeRepo.Update(token);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task RevokeRefreshTokenBySessionIdAsync(string sessionId)
    {
        var token = await readRepo.FirstOrDefaultAsync(x =>
            x.AuthSessionId == sessionId &&
            !x.IsUsed &&
            !x.IsRevoked &&
            x.ExpiresAt > DateTimeOffset.UtcNow);

        if(token == null)
        {
            throw new NotFoundException(localizer.Get("Error.Token.Get.NotFound"));
        }

        token.Revoke(ipResolver.GetClientIpV4());
        writeRepo.Update(token);
        await unitOfWork.SaveChangesAsync();
        // todo: redis inteqrasiyasin olandan sonra refresh token redis daxilinde blackList-e elave edilmelidir 
    }

    public async Task<AuthTokenResponse> RotateValidatedRefreshTokenAsync(string oldPlainToken, string userId,
        List<string> roles)
    {
        var existingToken = await GetTokenAsync(oldPlainToken, true);

        if(existingToken == null)
        {
            throw new NotFoundException(localizer.Get("Error.Token.Get.NotFound"));
        }

        var (plainToken, entity) = await CreateRefreshTokenInternalAsync(existingToken.AuthSessionId);
        var accessToken = GenerateAccessToken(userId, existingToken.AuthSessionId, roles);
        existingToken.MarkAsUsed(ipResolver.GetClientIpV4(), entity.Id);
        writeRepo.Update(existingToken);
        await unitOfWork.SaveChangesAsync();

        return new AuthTokenResponse
        {
            AccessToken = accessToken,
            RefreshToken = new RefreshTokenResponse
            {
                RefreshToken = plainToken,
                RefreshTokenExpiresAt = entity.ExpiresAt
            }
        };
    }

    public async Task RevokeAllRefreshTokens(string? currentSessionId = null)
    {
        var userId = claimsReader.GetUserId();
        var tokens = await readRepo.Where(x =>
                x.AuthSession.UserId == userId &&
                !x.IsUsed &&
                !x.IsRevoked)
            .Include(x => x.AuthSession)
            .AsTracking()
            .ToListAsync();

        if(!string.IsNullOrWhiteSpace(currentSessionId))
        {
            tokens = tokens.Where(x => x.AuthSessionId != currentSessionId).ToList();
        }

        tokens.ForEach(t => t.Revoke(ipResolver.GetClientIpV4()));

        writeRepo.UpdateRange(tokens);
        await unitOfWork.SaveChangesAsync();
    }

    // Helpers 
    private string HashRefreshToken(string token)
    {
        return hasher.Hash(token, _tokenOptions.SecurityKey);
    }

    private async Task<RefreshToken?> GetTokenAsync(string refreshToken, bool throwIfEmpty = false)
    {
        if(string.IsNullOrWhiteSpace(refreshToken))
        {
            if(throwIfEmpty)
            {
                throw new BadRequestException(
                    localizer.Get("Validation.Common.Validation.Required", "RefreshToken"));
            }

            return null;
        }

        var hash = HashRefreshToken(refreshToken);
        var includes = new List<Expression<Func<RefreshToken, object>>>
        {
            x => x.AuthSession
        };
        return await readRepo.FirstOrDefaultAsync(
            x => x.TokenHash == hash, false, includes);
    }

    private async Task<(string plainToken, RefreshToken entity)> CreateRefreshTokenInternalAsync(string sessionId)
    {
        var plainToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        var hash = HashRefreshToken(plainToken);

        var entity = new RefreshToken
        {
            AuthSessionId = sessionId,
            CreatedByIp = ipResolver.GetClientIpV4(),
            TokenHash = hash,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddMinutes(
                _tokenOptions.Lifetime.RefreshToken.TotalMinutes)
        };

        await writeRepo.AddAsync(entity);
        await unitOfWork.SaveChangesAsync();

        return (plainToken, entity);
    }
}