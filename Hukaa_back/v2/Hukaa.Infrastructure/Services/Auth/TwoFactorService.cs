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

}