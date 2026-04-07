namespace Hukaa.Persistence.Repositories.RefreshToken;

public class RefreshTokenWriteRepository(AppDbContext context)
    : WriteRepository<Domain.Entities.Auth.RefreshToken>(context),
        IRefreshTokenWriteRepository
{
}