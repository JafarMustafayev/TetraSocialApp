namespace Hukaa.Application.Options.Identity;

public sealed class UserOptions
{
    public bool RequireUniqueEmail { get; set; }
    public string AllowedUserNameCharacters { get; set; } = string.Empty;
}