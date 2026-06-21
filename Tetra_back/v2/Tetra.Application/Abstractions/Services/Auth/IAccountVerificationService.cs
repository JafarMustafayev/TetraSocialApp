using Tetra.Application.DTOs.Auth.Token;

namespace Tetra.Application.Abstractions.Services.Auth;

public interface IAccountVerificationService
{
    Task<VerificationTokenResultDto> GenerateEmailConfirmationTokenAsync(User user);
    Task<VerificationTokenResultDto> RegenerateEmailConfirmationTokenAsync(User user);
    Task ConfirmEmailAsync(User user, string token);
    Task<VerificationTokenResultDto> GeneratePasswordResetTokenAsync(User user);
    Task<VerificationTokenResultDto> RegeneratePasswordResetTokenAsync(User user);
    Task ResetPasswordAsync(User user, string token, string newPassword);
}