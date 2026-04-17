namespace Hukaa.Infrastructure.Services.Mail;

public class MailSender(
    IAppConfig config,
    ILocalizationService localizer) : IMailSender
{
    private readonly SmtpOptions _smtpOptions = config.GetSection<SmtpOptions>();

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        var message = new MailMessage
        {
            To =
            {
                to
            },
            Subject = subject,
            Body = body,
            IsBodyHtml = true,
            From = new MailAddress(
                _smtpOptions.FromAddress,
                _smtpOptions.DisplayName)
        };

        var client = new SmtpClient
        {
            Credentials = new NetworkCredential(_smtpOptions.Username, _smtpOptions.Password),
            EnableSsl = _smtpOptions.UseSsl,
            Host = _smtpOptions.Host,
            Port = _smtpOptions.Port,
            DeliveryMethod = SmtpDeliveryMethod.Network,
            UseDefaultCredentials = false,
            Timeout = _smtpOptions.Timeout
        };

        await client.SendMailAsync(message);
    }
}