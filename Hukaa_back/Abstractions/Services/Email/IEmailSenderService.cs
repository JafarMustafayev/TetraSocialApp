namespace Hukaa_back.Abstractions.Services.Email;

public interface IEmailSenderService
{
    public Task SendEmailConfirmationAsync(string email, string link);
    public Task SendForgotPasswordAsync(string email, string link);
}