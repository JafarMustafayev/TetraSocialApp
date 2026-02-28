namespace Hukaa_back.Services.Notification;

public class EmailSenderService(
    IAppConfig appConfig
) : IEmailSenderService
{
    private readonly SmtpParameters _smptParameters = appConfig.GetSection<SmtpParameters>("SmtpParameters");

    public Task SendEmailConfirmationAsync(string email, string link)
    {
        var subject = "Email Address Confirmation";

        var body = $"""
                    <p>Dear User,</p>

                    <p>
                        Thank you for registering with our service.
                        To complete your account setup, please confirm your email address by clicking the link below:
                    </p>

                    <p>
                        <a href="{link}">Confirm Email Address</a>
                    </p>

                    <p>
                        If you did not create an account, please ignore this message.
                    </p>

                    <p>
                        If the button above does not work, please copy and paste the following URL into your browser:
                    </p>

                    <p>{link}</p>

                    <p>Kind regards,<br/>Support Team</p>
                    """;

        return SendEmailAsync(email, subject, body);
    }

    public Task SendForgotPasswordAsync(string email, string link)
    {
        var subject = "Password Reset Request";

        var body = $"""
                    <p>Dear User,</p>

                    <p>
                        We received a request to reset the password associated with your account.
                        To proceed, please click the link below:
                    </p>

                    <p>
                        <a href="{link}">Reset Password</a>
                    </p>

                    <p>
                        If you did not request a password reset, no further action is required.
                    </p>

                    <p>
                        If the link above does not work, please copy and paste the following URL into your browser:
                    </p>

                    <p>{link}</p>

                    <p>Kind regards,<br/>Support Team</p>
                    """;

        return SendEmailAsync(email, subject, body);
    }

    private async Task SendEmailAsync(string email, string subject, string body)
    {
        var message = new MailMessage
        {
            Subject = subject,
            Body = body,
            IsBodyHtml = true,
            To = { email },
            From = new MailAddress(_smptParameters.FromAddress, _smptParameters.FromDisplayName)
        };

        var smtpClient = new SmtpClient
        {
            Host = _smptParameters.Host,
            Port = _smptParameters.Port,
            Credentials = new NetworkCredential(_smptParameters.Username, _smptParameters.Password),
            EnableSsl = _smptParameters.UseSsl
        };

        await smtpClient.SendMailAsync(message);
    }
}