namespace Hukaa.Application.DTOs.UserDevice;

public class UserDeviceSnapshot
{
    public string OS { get; set; } = "Unknown";
    public string DeviceType { get; set; } = "Unknown";
    public string Browser { get; set; } = "Unknown";
    public string UserAgent { get; set; } = "Unknown";
}