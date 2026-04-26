namespace Hukaa.Domain.Enums;

public enum VerificationTokenRevocationReason
{
    Manual = 1,
    Superseded,
    Security,
    UserRequested
}