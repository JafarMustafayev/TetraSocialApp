namespace Tetra.Application.Abstractions.Services.Auth;

public interface IVerificationTokenService
{
    Task<(string plainToken, VerificationToken entity)> GenerateTokenAsync(string userId,
        VerificationTokenPurpose purpose, string? target = null);
    Task<VerificationToken> ValidateTokenAsync(string plainToken, VerificationTokenPurpose purpose);
    Task ConsumeTokenAsync(VerificationToken token);
    Task<(string plainToken, VerificationToken entity)> SupersedeTokenAsync(string userId,
        VerificationTokenPurpose purpose, string? target = null);
    Task RevokeTokenAsync(VerificationToken token,
        VerificationTokenRevocationReason reason = VerificationTokenRevocationReason.Manual);
}