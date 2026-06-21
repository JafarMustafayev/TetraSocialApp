using Tetra.Persistence.Context;
using Tetra.Persistence.Repositories.Base;

namespace Tetra.Persistence.Repositories.AuthSessionRepos;

public class AuthSessionWriteRepository(AppDbContext context)
    : WriteRepository<AuthSession>(context)
        , IAuthSessionWriteRepository
{
}