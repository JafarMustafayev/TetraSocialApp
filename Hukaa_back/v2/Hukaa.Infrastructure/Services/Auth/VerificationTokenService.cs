namespace Hukaa.Infrastructure.Services.Auth;

public class VerificationTokenService(
    ILocalizationService localizer,
    UserManager<User> userManager,
    IVerificationTokenReadRepository readRepo,
    IVerificationTokenWriteRepository writeRepo) : IVerificationTokenService
{
    public Task<string> GenerateTokenAsync(string userId, VerificationTokenPurpose purpose, string? email = null)
    {
        throw new NotImplementedException();
    }

    public Task<VerificationToken> ValidateTokenAsync(string token, VerificationTokenPurpose purpose)
    {
        throw new NotImplementedException();
    }

    public Task ConsumeTokenAsync(VerificationToken token)
    {
        throw new NotImplementedException();
    }

    public Task RevokeTokenAsync(VerificationToken token)
    {
        throw new NotImplementedException();
    }

    public Task SupersedeTokenAsync(string userId, VerificationTokenPurpose purpose)
    {
        throw new NotImplementedException();
    }
}