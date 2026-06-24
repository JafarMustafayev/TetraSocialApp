namespace Tetra.Persistence.Repositories.Auth.TwoFactorRepositories;

public class TwoFactorRecoveryCodeReadRepository(AppDbContext context)
    : ReadRepository<TwoFactorRecoveryCode>(context),
        ITwoFactorRecoveryCodeReadRepository
{
}