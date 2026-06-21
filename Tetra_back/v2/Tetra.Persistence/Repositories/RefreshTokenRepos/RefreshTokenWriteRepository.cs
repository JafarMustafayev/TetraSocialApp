using Tetra.Persistence.Context;
using Tetra.Persistence.Repositories.Base;

namespace Tetra.Persistence.Repositories.RefreshTokenRepos;

public class RefreshTokenWriteRepository(AppDbContext context)
    : WriteRepository<RefreshToken>(context),
        IRefreshTokenWriteRepository
{
}