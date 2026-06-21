namespace Tetra.Application.Options.Token;

public class RefreshTokenOptions
{
    public bool RotateOnUse { get; init; } = true;
    public bool RevokeOnReuse { get; init; } = true;
}