namespace Hukaa.Application.Abstractions.Services.Auth;

public interface IVerificationTokenService
{
    Task<string> GenerateTokenAsync(string userId, VerificationTokenPurpose purpose, string? email = null);

    Task<VerificationToken> ValidateTokenAsync(string token, VerificationTokenPurpose purpose);

    Task ConsumeTokenAsync(VerificationToken token);

    Task RevokeTokenAsync(VerificationToken token);

    Task SupersedeTokenAsync(string userId, VerificationTokenPurpose purpose);
}