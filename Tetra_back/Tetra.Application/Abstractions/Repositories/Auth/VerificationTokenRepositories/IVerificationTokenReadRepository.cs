namespace Tetra.Application.Abstractions.Repositories.Auth.VerificationTokenRepositories;

public interface IVerificationTokenReadRepository : IReadRepository<VerificationToken>
{
    Task<VerificationToken?> GetByHashAndPurposeAsync(string hash, VerificationTokenPurpose purpose);
    Task<VerificationToken?> GetActiveTokenAsync(string userId, VerificationTokenPurpose purpose);
}