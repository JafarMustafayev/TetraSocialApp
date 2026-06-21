namespace Tetra.Application.DTOs.Auth.TwoFactor;

public sealed class RecoveryCodesResponseDto
{
    public IReadOnlyList<string> Codes { get; set; } = [];
}