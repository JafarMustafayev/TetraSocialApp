using Tetra.Persistence.Context;
using Tetra.Persistence.Repositories.Base;

namespace Tetra.Persistence.Repositories.AuthSessionRepos;

public class AuthSessionReadRepository(AppDbContext context)
    : ReadRepository<AuthSession>(context)
        , IAuthSessionReadRepository
{
}