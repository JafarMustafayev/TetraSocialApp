namespace Tetra.Persistence.Repositories.AuthSessionRepos;

public class AuthSessionReadRepository(AppDbContext context)
    : ReadRepository<AuthSession>(context)
        , IAuthSessionReadRepository
{
}