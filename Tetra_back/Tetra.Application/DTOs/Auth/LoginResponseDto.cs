namespace Tetra.Application.DTOs.Auth;

public class LoginResponseDto
{
    public bool RequiresTwoFactor { get; set; }

    public AuthTokenResponse? Tokens { get; set; }

    public TwoFactorChallengeResponseDto? TwoFactorChallenge { get; set; }
}