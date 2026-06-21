namespace Tetra.Application.Options.BusinessRules;

public sealed class SessionBusinessRulesOptions
{
    public int MaxActiveSessionsPerUser { get; set; } = 5;
    public bool RevokeOldestSessionWhenLimitExceeded { get; set; } = true;
    public bool AllowMultipleSessionsFromSameDevice { get; set; } = false;

}