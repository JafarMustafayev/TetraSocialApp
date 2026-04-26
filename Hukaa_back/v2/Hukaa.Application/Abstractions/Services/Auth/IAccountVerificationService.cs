namespace Hukaa.Application.Abstractions.Services.Auth;

public interface IAccountVerificationService
{
    Task<string> GenerateEmailConfirmationTokenAsync(User user);
    Task ConfirmEmailAsync(User user, string token);
    Task<string> GeneratePasswordResetTokenAsync(User user);
    Task ResetPasswordAsync(User user, string token, string newPassword);
}