namespace Hukaa.Application.DTOs.Auth;

public sealed class VerificationTokenResultDto
{
    public string PlainToken { get; init; } = null!;

    public string ExpiresAt { get; init; } = null!;
}