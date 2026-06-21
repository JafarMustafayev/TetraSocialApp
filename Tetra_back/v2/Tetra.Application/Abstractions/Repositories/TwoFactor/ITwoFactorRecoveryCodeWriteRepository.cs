using Tetra.Application.Abstractions.Repositories.Base;

namespace Tetra.Application.Abstractions.Repositories.TwoFactor;

public interface ITwoFactorRecoveryCodeWriteRepository : IWriteRepository<TwoFactorRecoveryCode>
{
}