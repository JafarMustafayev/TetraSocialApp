namespace Tetra.Persistence.Repositories.RefreshTokenRepos;

public class RefreshTokenWriteRepository(AppDbContext context)
    : WriteRepository<RefreshToken>(context),
        IRefreshTokenWriteRepository
{
}