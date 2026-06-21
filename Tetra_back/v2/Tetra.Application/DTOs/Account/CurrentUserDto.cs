namespace Tetra.Application.DTOs.Account;

public class CurrentUserDto
{
    public string Id { get; set; } = null!;
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string AvatarUrl { get; set; } = null!;
    public bool IsAdmin { get; set; }
    public bool EmailVerified { get; set; }
    public int AccentHue { get; set; }
}