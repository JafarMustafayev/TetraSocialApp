namespace Hukaa.Application.Options.Identity;

public sealed class LockoutOptions
{
    public TimeSpan DefaultLockoutTimeSpan { get; set; }
    public int MaxFailedAccessAttempts { get; set; }
    public bool AllowedForNewUsers { get; set; }
}