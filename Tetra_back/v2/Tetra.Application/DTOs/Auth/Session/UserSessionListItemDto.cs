namespace Tetra.Application.DTOs.Auth.Session;

public class UserSessionListItemDto
{
    public string Id { get; set; } = null!;
    public string UserAgent { get; set; } = null!;
    public string DeviceInfo { get; set; } = null!;
    public string CreatedByIp { get; set; } = null!;
    public string LocationInfo { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime LastActivityAt { get; set; }
    public bool IsCurrent { get; set; }
}