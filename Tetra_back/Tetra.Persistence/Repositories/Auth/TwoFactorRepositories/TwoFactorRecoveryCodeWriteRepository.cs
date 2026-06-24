namespace Tetra.Persistence.Repositories.Auth.TwoFactorRepositories;

public class TwoFactorRecoveryCodeWriteRepository(AppDbContext context)
    : WriteRepository<TwoFactorRecoveryCode>(context),
        ITwoFactorRecoveryCodeWriteRepository
{
}