namespace Hukaa.Application.Options.BusinessRules;

public sealed class BusinessRulesOptions
{
    public SessionBusinessRulesOptions Session { get; set; } = new();
    public TwoFactorAuthBusinessRulesOptions TwoFactorAuth { get; set; } = new();
}