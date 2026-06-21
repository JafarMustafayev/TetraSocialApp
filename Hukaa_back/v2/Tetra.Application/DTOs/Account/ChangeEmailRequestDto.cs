namespace Tetra.Application.DTOs.Account;

public class ChangeEmailRequestDto
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}