namespace Tetra.Persistence.Repositories.Auth.AuthSessionRepositories;

public class AuthSessionWriteRepository(AppDbContext context)
    : WriteRepository<AuthSession>(context)
        , IAuthSessionWriteRepository
{
}