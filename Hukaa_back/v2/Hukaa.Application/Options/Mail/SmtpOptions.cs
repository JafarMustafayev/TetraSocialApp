namespace Hukaa.Application.Options.Mail;

public class SmtpOptions
{
    public string Host { get; init; } = string.Empty;
    public int Port { get; init; }
    public string Username { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;

    public bool UseSsl { get; init; }
    public int Timeout { get; init; } = 30;

    public string FromAddress { get; init; } = string.Empty;
    public string DisplayName { get; init; } = string.Empty;
}