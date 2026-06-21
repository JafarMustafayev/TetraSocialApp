using Tetra.Persistence.Context;
using Tetra.Persistence.Repositories.Base;

namespace Tetra.Persistence.Repositories.TwoFactor;

public class TwoFactorRecoveryCodeReadRepository(AppDbContext context)
    : ReadRepository<TwoFactorRecoveryCode>(context),
        ITwoFactorRecoveryCodeReadRepository
{
}