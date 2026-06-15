namespace Hukaa.Persistence.Repositories.TwoFactor;

public class TwoFactorRecoveryCodeReadRepository(AppDbContext context)
    : ReadRepository<TwoFactorRecoveryCode>(context),
        ITwoFactorRecoveryCodeReadRepository
{
}