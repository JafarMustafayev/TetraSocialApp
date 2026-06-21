using Tetra.Persistence.Context;
using Tetra.Persistence.Repositories.Base;

namespace Tetra.Persistence.Repositories.VerificationTokenRepos;

public class VerificationTokenReadRepository(AppDbContext context)
    : ReadRepository<VerificationToken>(context), IVerificationTokenReadRepository
{

    public async Task<VerificationToken?> GetByHashAndPurposeAsync(string hash, VerificationTokenPurpose purpose)
    {
        return await FirstOrDefaultAsync(x =>
            x.TokenHash == hash &&
            x.Purpose == purpose);
    }
    public async Task<VerificationToken?> GetActiveTokenAsync(string userId, VerificationTokenPurpose purpose)
    {
        return await FirstOrDefaultAsync(x =>
            x.UserId == userId &&
            x.Purpose == purpose);
    }
}