namespace Tetra.Persistence.Repositories.Auth.RefreshTokenRepositories;

public class RefreshTokenReadRepository(AppDbContext context) :
    ReadRepository<RefreshToken>(context),
    IRefreshTokenReadRepository
{
}