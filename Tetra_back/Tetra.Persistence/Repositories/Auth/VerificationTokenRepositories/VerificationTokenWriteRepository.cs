namespace Tetra.Persistence.Repositories.Auth.VerificationTokenRepositories;

public class VerificationTokenWriteRepository(AppDbContext context)
    : WriteRepository<VerificationToken>(context), IVerificationTokenWriteRepository
{
}