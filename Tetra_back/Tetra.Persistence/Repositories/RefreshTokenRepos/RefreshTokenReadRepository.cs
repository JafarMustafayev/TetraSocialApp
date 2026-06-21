using Tetra.Persistence.Context;
using Tetra.Persistence.Repositories.Base;

namespace Tetra.Persistence.Repositories.RefreshTokenRepos;

public class RefreshTokenReadRepository(AppDbContext context) :
    ReadRepository<RefreshToken>(context),
    IRefreshTokenReadRepository
{
}