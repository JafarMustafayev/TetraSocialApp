namespace Hukaa.Application.Options.Validation.Auth;

public class TwoFactorValidationOptions
{
    public StringValidationRule Code { get; set; } = new();
    public StringValidationRule ChallengeId { get; set; } = new();
    public StringValidationRule RecoveryCode { get; set; } = new();
    public StringValidationRule Password { get; set; } = new();
}