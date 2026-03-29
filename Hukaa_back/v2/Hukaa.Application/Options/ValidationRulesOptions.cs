namespace Hukaa.Application.Options;

public class ValidationRulesOptions
{
    public AuthValidationRules Auth { get; set; } = new();
}

public class AuthValidationRules
{
    public LoginValidationRules Login { get; set; } = new();
    public RegisterValidationRules Register { get; set; } = new();
}