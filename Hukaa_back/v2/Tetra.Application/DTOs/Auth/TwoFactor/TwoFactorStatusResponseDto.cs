namespace Tetra.Application.DTOs.Auth.TwoFactor;

public sealed class TwoFactorStatusResponseDto
{
    public bool IsEnabled { get; init; }
    public TwoFactorDetailsDto Details { get; init; } = new();
}

public sealed class TwoFactorDetailsDto
{
    public string Provider { get; set; } = nameof (TwoFactorProvider.None);
    public int RecoveryCodesCount { get; set; }
}