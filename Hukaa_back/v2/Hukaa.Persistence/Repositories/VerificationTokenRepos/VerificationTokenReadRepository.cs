namespace Hukaa.Persistence.Repositories.VerificationTokenRepos;

public class VerificationTokenReadRepository(AppDbContext context)
    : ReadRepository<VerificationToken>(context), IVerificationTokenReadRepository
{
}