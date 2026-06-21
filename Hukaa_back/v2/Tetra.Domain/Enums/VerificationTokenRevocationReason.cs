namespace Tetra.Domain.Enums;

public enum VerificationTokenRevocationReason
{
    Manual = 1,
    Superseded,
    Security,
    UserRequested
}