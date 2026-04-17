namespace Hukaa.Application.Options.Identity;

public sealed class SignInOptions
{
    public bool RequireConfirmedEmail { get; set; }
    public bool RequireConfirmedAccount { get; set; }
    public bool RequireConfirmedPhoneNumber { get; set; }
}