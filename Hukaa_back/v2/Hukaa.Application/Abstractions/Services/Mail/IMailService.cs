namespace Hukaa.Application.Abstractions.Services.Mail;

public interface IMailService
{
    public Task SendConfirmationMail(string to, string link);
    public Task SendPasswordResetMail(string to, string link);
}