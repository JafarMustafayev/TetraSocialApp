namespace Hukaa.Persistence.Repositories.AuthSessionRepos;

public class AuthSessionWriteRepository(AppDbContext context)
    : WriteRepository<AuthSession>(context)
        , IAuthSessionWriteRepository
{
}