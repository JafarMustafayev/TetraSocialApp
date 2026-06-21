using Tetra.Application.Options.Validation.Common;

namespace Tetra.Application.Options.Validation.Auth;

public sealed class LoginValidationOptions
{
    public StringValidationRule EmailOrUsername { get; set; } = new();
    public StringValidationRule Password { get; set; } = new();
}