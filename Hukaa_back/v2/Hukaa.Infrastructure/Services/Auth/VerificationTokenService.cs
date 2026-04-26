namespace Hukaa.Infrastructure.Services.Auth;

public class VerificationTokenService(
    ILocalizationService localizer,
    IClientIpResolver ipResolver,
    ITokenHasher tokenHasher,
    IAppConfig appConfig,
    IVerificationTokenReadRepository readRepo,
    IVerificationTokenWriteRepository writeRepo,
    IUnitOfWork unitOfWork) : IVerificationTokenService
{
    private readonly TokenOptions _tokenOptions = appConfig.GetSection<TokenOptions>();

    public async Task<string> GenerateTokenAsync(
        string userId,
        VerificationTokenPurpose purpose,
        string? target = null)
    {
        var newTokens = await CreateTokenInternalAsync(userId, purpose, target);
        return newTokens.plainToken;
    }

    public async Task<VerificationToken> ValidateTokenAsync(
        string plainToken,
        VerificationTokenPurpose purpose)
    {
        var tokenHash = HashToken(plainToken);

        var token = await readRepo.GetByHashAndPurposeAsync(tokenHash, purpose);

        if(token is null)
        {
            throw new ValidationException(
                localizer.Get("Error.Token.Validate.Invalid"));
        }

        if(token.IsUsed)
        {
            throw new ValidationException(
                localizer.Get("Error.Token.Validate.Used"));
        }

        if(token.IsRevoked)
        {
            throw new ValidationException(
                localizer.Get("Error.Token.Validate.Revoked"));
        }

        if(token.IsExpired)
        {
            throw new ValidationException(
                localizer.Get("Error.Token.Validate.Expired"));
        }

        return token;
    }

    public async Task ConsumeTokenAsync(VerificationToken token)
    {
        token.MarkAsUsed(ipResolver.GetClientIpV4());

        writeRepo.Update(token);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task RevokeTokenAsync(
        VerificationToken token,
        VerificationTokenRevocationReason reason = VerificationTokenRevocationReason.Manual)
    {
        token.Revoke(ipResolver.GetClientIpV4(), reason);

        writeRepo.Update(token);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task<string> SupersedeTokenAsync(
        string userId,
        VerificationTokenPurpose purpose,
        string? target = null)
    {
        var activeToken = await readRepo.GetActiveTokenAsync(userId, purpose);

        var newTokens = await CreateTokenInternalAsync(
            userId,
            purpose,
            target ?? activeToken?.Target);

        if(activeToken is null)
        {
            return newTokens.plainToken;
        }

        var newToken = await readRepo.GetByHashAndPurposeAsync(newTokens.hasedToken, purpose);

        if(newToken is null)
        {
            throw new ValidationException(
                localizer.Get("Error.Token.Validate.Invalid"));
        }

        activeToken.Supersede(
            ipResolver.GetClientIpV4(),
            VerificationTokenRevocationReason.Superseded,
            newToken.Id);

        writeRepo.Update(activeToken);
        await unitOfWork.SaveChangesAsync();

        return newTokens.plainToken;
    }

    private async Task<(string plainToken, string hasedToken)> CreateTokenInternalAsync(
        string userId,
        VerificationTokenPurpose purpose,
        string? target = null)
    {
        var plainToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        var tokenHash = HashToken(plainToken);

        var token = new VerificationToken
        {
            UserId = userId,
            TokenHash = tokenHash,
            Purpose = purpose,
            Target = target,
            CreatedByIp = ipResolver.GetClientIpV4(),
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.Add(GetTokenLifetime(purpose))
        };

        await writeRepo.AddAsync(token);
        await unitOfWork.SaveChangesAsync();

        return (plainToken, tokenHash);
    }

    private string HashToken(string plainToken)
    {
        return tokenHasher.Hash(plainToken, _tokenOptions.SecurityKey);
    }

    private TimeSpan GetTokenLifetime(VerificationTokenPurpose purpose)
    {
        return purpose switch
        {
            VerificationTokenPurpose.EmailConfirmation =>
                _tokenOptions.Lifetime.EmailConfirmationToken,

            VerificationTokenPurpose.PasswordReset =>
                _tokenOptions.Lifetime.PasswordResetToken,

            VerificationTokenPurpose.EmailChange =>
                _tokenOptions.Lifetime.EmailChangeToken,

            VerificationTokenPurpose.LoginVerification =>
                _tokenOptions.Lifetime.LoginVerificationToken,

            VerificationTokenPurpose.TwoFactorVerification =>
                _tokenOptions.Lifetime.TwoFactorVerificationToken,

            _ => throw new ValidationException(
                localizer.Get("Error.Token.Validate.InvalidPurpose"))
        };
    }
}