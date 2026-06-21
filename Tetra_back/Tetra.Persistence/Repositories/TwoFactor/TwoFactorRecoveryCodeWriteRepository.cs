namespace Tetra.Persistence.Repositories.TwoFactor;

public class TwoFactorRecoveryCodeWriteRepository(AppDbContext context)
    : WriteRepository<TwoFactorRecoveryCode>(context),
        ITwoFactorRecoveryCodeWriteRepository
{
}