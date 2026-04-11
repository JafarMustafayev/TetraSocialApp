namespace Hukaa.Application.Options.ValidationRules.Auth;

public class RegisterValidationRules
{
    public FieldRule FirstName { get; set; } = new();
    public FieldRule LastName { get; set; } = new();
    public FieldRule DateOfBirth { get; set; } = new();
    public FieldRule UserName { get; set; } = new();
    public FieldRule Email { get; set; } = new();
    public FieldRule Password { get; set; } = new();
}