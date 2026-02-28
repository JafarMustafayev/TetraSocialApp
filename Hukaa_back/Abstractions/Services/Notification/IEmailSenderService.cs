namespace Hukaa_back.Abstractions.Services.Notification;

public interface IEmailSenderService
{
    public Task SendEmailConfirmationAsync(string email, string link);
    public Task SendForgotPasswordAsync(string email, string link);
}