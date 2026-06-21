using Tetra.Persistence.Context;
using Tetra.Persistence.Repositories.Base;

namespace Tetra.Persistence.Repositories.VerificationTokenRepos;

public class VerificationTokenWriteRepository(AppDbContext context)
    : WriteRepository<VerificationToken>(context), IVerificationTokenWriteRepository
{
}