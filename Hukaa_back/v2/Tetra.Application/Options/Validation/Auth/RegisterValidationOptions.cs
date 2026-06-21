using Tetra.Application.Options.Validation.Common;

namespace Tetra.Application.Options.Validation.Auth;

public sealed class RegisterValidationOptions
{
    public StringValidationRule FirstName { get; set; } = new();
    public StringValidationRule LastName { get; set; } = new();
    public DateTimeValidationRule DateOfBirth { get; set; } = new();
    public StringValidationRule UserName { get; set; } = new();
    public StringValidationRule Email { get; set; } = new();
    public StringValidationRule Password { get; set; } = new();
}