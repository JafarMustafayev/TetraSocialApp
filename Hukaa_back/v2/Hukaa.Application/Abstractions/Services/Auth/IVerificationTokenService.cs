namespace Hukaa.Application.Abstractions.Services.Auth;

public interface IVerificationTokenService
{
    Task<string> GenerateTokenAsync(string userId, VerificationTokenPurpose purpose, string? target = null);
    Task<VerificationToken> ValidateTokenAsync(string plainToken, VerificationTokenPurpose purpose);
    Task ConsumeTokenAsync(VerificationToken token);
    Task<string> SupersedeTokenAsync(string userId, VerificationTokenPurpose purpose, string? target = null);
    Task RevokeTokenAsync(VerificationToken token,
        VerificationTokenRevocationReason reason = VerificationTokenRevocationReason.Manual);
}