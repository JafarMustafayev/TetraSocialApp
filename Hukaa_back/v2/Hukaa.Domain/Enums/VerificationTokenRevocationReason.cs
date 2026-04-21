namespace Hukaa.Domain.Enums;

public enum VerificationTokenRevocationReason
{
    Superseded = 1, // resend zamanı
    EmailChanged,
    PasswordChanged,
    SecurityAction
}