namespace Hukaa.Application.DTOs.Auth.Token;

public sealed class VerificationTokenResultDto
{
    public string PlainToken { get; init; } = null!;

    public string ExpiresAt { get; init; } = null!;
}