namespace Tetra.Persistence.Repositories.RefreshTokenRepos;

public class RefreshTokenReadRepository(AppDbContext context) :
    ReadRepository<RefreshToken>(context),
    IRefreshTokenReadRepository
{
}