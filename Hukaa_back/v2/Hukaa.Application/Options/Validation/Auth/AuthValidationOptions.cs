namespace Hukaa.Application.Options.Validation.Auth;

public sealed class AuthValidationOptions
{
    public LoginValidationOptions Login { get; set; } = new();
    public RegisterValidationOptions Register { get; set; } = new();
}