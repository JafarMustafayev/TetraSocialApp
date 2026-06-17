namespace Hukaa.Application.Options.BusinessRules;

public class TwoFactorAuthBusinessRulesOptions
{
    public int MaxAttempts { get; set; } = 5;
    public TimeSpan FailTtl { get; set; }
    public TimeSpan LockTtl { get; set; }
};