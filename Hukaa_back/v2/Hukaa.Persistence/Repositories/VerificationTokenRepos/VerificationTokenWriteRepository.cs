namespace Hukaa.Persistence.Repositories.VerificationTokenRepos;

public class VerificationTokenWriteRepository(AppDbContext context)
    : WriteRepository<VerificationToken>(context), IVerificationTokenWriteRepository
{
}