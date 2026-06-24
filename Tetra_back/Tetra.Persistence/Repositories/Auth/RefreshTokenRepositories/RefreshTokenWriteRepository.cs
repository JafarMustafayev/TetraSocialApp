namespace Tetra.Persistence.Repositories.Auth.RefreshTokenRepositories;

public class RefreshTokenWriteRepository(AppDbContext context)
    : WriteRepository<RefreshToken>(context),
        IRefreshTokenWriteRepository
{
}