namespace Tetra.Application.Abstractions.Services.Mail;

public interface IMailSender
{
    public Task SendEmailAsync(string to, string subject, string body);
}