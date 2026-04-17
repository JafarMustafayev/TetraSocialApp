namespace Hukaa.Application.Options.Identity;

public class IdentityOptions
{
    public PasswordOptions Password { get; set; } = new();
    public UserOptions User { get; set; } = new();
    public SignInOptions SignIn { get; set; } = new();
    public LockoutOptions Lockout { get; set; } = new();
}