namespace Hukaa.Infrastructure.Services.Auth;

public class TwoFactorService(
    UserManager<User> userManager,
    ILocalizationService localizer,
    IJwtClaimsReader claimsReader,
    IAppConfig appConfig,
    ITokenHasher tokenHasher,
    ITwoFactorRecoveryCodeReadRepository recoveryCodeReadRepo,
    ITwoFactorRecoveryCodeWriteRepository recoveryCodeWriteRepo,
    IUnitOfWork uni,
    IRedisCacheService redisCacheService
) : ITwoFactorService
{
    private readonly TwoFactorAuthBusinessRulesOptions _rulesOptions = appConfig.GetSection<BusinessRulesOptions>().TwoFactorAuth;

    public async Task<ResponseDto<TwoFactorStatusResponseDto>> GetStatusAsync()
    {
        var user = await GetUserAsync();

        if(!user.TwoFactorEnabled)
        {
            return ResponseDto<TwoFactorStatusResponseDto>.OkResponse(localizer.Get("Auth.TwoFactor.Status.Retrieved"),
                new TwoFactorStatusResponseDto());
        }

        var count = await recoveryCodeReadRepo.CountAsync(x =>
            x.UserId == user.Id
            && !x.IsUsed);

        return ResponseDto<TwoFactorStatusResponseDto>.OkResponse(localizer.Get("Auth.TwoFactor.Status.Retrieved"),
            new TwoFactorStatusResponseDto
            {
                IsEnabled = true,
                Details = new TwoFactorDetailsDto
                {
                    RecoveryCodesCount = count,
                    Provider = user.TwoFactorProvider.ToString()
                }
            });
    }

    public async Task<ResponseDto<AuthenticatorSetupResponseDto>> SetupAuthenticatorAsync(EnableTwoFactorRequestDto request)
    {
        var user = await GetUserAsync();

        await CheckSetupLockAsync(user.Id);

        var isValidPassword = await userManager.CheckPasswordAsync(user, request.Password);
        if(!isValidPassword)
        {
            await IncrementSetupFailCountAsync(user.Id);
            throw new UnauthorizedException(localizer.Get("Auth.Login.Failure.InvalidPassword"));
        }

        if(user.TwoFactorEnabled)
        {
            throw new ConflictException(localizer.Get("Auth.TwoFactor.Setup.AlreadyEnabled"));
        }

        await ResetSetupFailCountAsync(user.Id);
        await redisCacheService.RemoveAsync(GetSetupKey(user.Id));

        var secretKey = GenerateSecretKey();
        var authUri = GenerateAuthUri(secretKey, user.Id);

        await redisCacheService.SetAsync(GetSetupKey(user.Id), secretKey, TimeSpan.FromMinutes(10));

        var setupResponse = new AuthenticatorSetupResponseDto
        {
            QrCodeUri = authUri,
            SharedKey = secretKey,
            ExpiresAt = DateTime.UtcNow.AddMinutes(10)
        };
        return ResponseDto<AuthenticatorSetupResponseDto>.OkResponse(
            localizer.Get("Auth.TwoFactor.Setup.Success"), setupResponse);
    }

    // Private 
    private async Task<User> GetUserAsync()
    {
        var userId = claimsReader.GetUserId();
        var user = await userManager.FindByIdAsync(userId);

        if(user == null)
        {
            throw new NotFoundException(localizer.Get("Error.Common.NotFoundWithParameter", "User",
                new Dictionary<string, object>
                {
                    ["Parameter"] = userId
                }
            ));
        }

        return user;
    }

    private string GenerateSecretKey()
    {
        var key = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(key);
        return Base32Encoding.ToString(key).TrimEnd('=');
    }
    private string GenerateAuthUri(string secretKey, string accountName, string issuer = "Hukaa")
    {
        var encodedIssuer = Uri.EscapeDataString(issuer);
        var encodedAccountName = Uri.EscapeDataString(accountName);

        return $"otpauth://totp/{encodedIssuer}:{encodedAccountName}" +
               $"?secret={secretKey}" +
               $"&issuer={encodedIssuer}" +
               $"&algorithm=SHA1" +
               $"&digits=6" +
               $"&period=30";
    }

    private string GetSetupKey(string userId)
    {
        return $"2fa:authenticator-setup:{userId}";
    }
    private string GetFailKey(string userId)
    {
        return $"2fa:setup:fail:{userId}";
    }
    private string GetLockKey(string userId)
    {
        return $"2fa:setup:lock:{userId}";
    }

    private async Task CheckSetupLockAsync(string userId)
    {
        var lockKey = GetLockKey(userId);
        var isLocked = await redisCacheService.ExistsAsync(lockKey);

        if(isLocked)
        {
            throw new TooManyRequestsException(localizer.Get("Auth.TooManyAttempts.TryAgainLater"));
        }
    }
    private async Task IncrementSetupFailCountAsync(string userId)
    {
        var failKey = GetFailKey(userId);
        var lockKey = GetLockKey(userId);
        var count = await redisCacheService.GetAsync<int?>(failKey) ?? 0;
        count++;

        if(count >= _rulesOptions.MaxAttempts)
        {
            await redisCacheService.SetAsync(lockKey, "1", _rulesOptions.LockTtl);
            await redisCacheService.RemoveAsync(failKey);
            return;
        }

        await redisCacheService.SetAsync(failKey, count, _rulesOptions.FailTtl);
    }
    private async Task ResetSetupFailCountAsync(string userId)
    {
        var key = GetFailKey(userId);
        await redisCacheService.RemoveAsync(key);
    }

}