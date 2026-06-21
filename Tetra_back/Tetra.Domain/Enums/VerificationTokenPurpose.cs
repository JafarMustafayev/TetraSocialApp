namespace Tetra.Domain.Enums;

public enum VerificationTokenPurpose
{
    EmailConfirmation = 1,
    PasswordReset,
    EmailChange,
    LoginVerification,
    TwoFactorVerification
}