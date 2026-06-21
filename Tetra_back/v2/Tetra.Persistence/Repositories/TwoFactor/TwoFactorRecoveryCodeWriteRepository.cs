using Tetra.Persistence.Context;
using Tetra.Persistence.Repositories.Base;

namespace Tetra.Persistence.Repositories.TwoFactor;

public class TwoFactorRecoveryCodeWriteRepository(AppDbContext context)
    : WriteRepository<TwoFactorRecoveryCode>(context),
        ITwoFactorRecoveryCodeWriteRepository
{
}