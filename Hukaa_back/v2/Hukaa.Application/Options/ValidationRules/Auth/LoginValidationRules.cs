namespace Hukaa.Application.Options.ValidationRules.Auth;

public class LoginValidationRules
{
    public FieldRule EmailOrUsername { get; set; } = new();
    public FieldRule Password { get; set; } = new();
}