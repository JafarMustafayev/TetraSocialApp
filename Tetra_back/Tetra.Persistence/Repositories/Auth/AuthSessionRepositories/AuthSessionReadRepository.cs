namespace Tetra.Persistence.Repositories.Auth.AuthSessionRepositories;

public class AuthSessionReadRepository(AppDbContext context)
    : ReadRepository<AuthSession>(context)
        , IAuthSessionReadRepository
{
}