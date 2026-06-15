namespace Hukaa.Persistence.Repositories.TwoFactor;

public class TwoFactorRecoveryCodeWriteRepository(AppDbContext context)
    : WriteRepository<TwoFactorRecoveryCode>(context),
        ITwoFactorRecoveryCodeWriteRepository
{
}