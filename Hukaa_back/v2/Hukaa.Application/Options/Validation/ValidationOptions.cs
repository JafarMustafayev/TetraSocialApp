namespace Hukaa.Application.Options.Validation;

public sealed class ValidationOptions
{
    public AuthValidationOptions Auth { get; set; } = new();
}