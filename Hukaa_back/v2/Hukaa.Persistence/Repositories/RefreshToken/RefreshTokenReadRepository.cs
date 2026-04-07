namespace Hukaa.Persistence.Repositories.RefreshToken;

public class RefreshTokenReadRepository(AppDbContext context) :
    ReadRepository<Domain.Entities.Auth.RefreshToken>(context),
    IRefreshTokenReadRepository
{
}