namespace Hukaa_back.Enums;

public enum UserStatus
{
    Active = 1,
    Inactive,
    Suspended,
    Deleted,
    PendingVerification,
    Banned,
    LockedOut,
    Archived,
    DeactivatedByUser
}