namespace Hukaa.Infrastructure.Services.Common;

public class UserAgentParser(
    IHttpContextAccessor accessor) : IUserAgentParser
{
    private const string Unknown = "UNKNOWN";

    public UserDeviceSnapshot Parse()
    {
        var ua = accessor.HttpContext?.Request.Headers["User-Agent"];
        if(string.IsNullOrWhiteSpace(ua))
        {
            return new UserDeviceSnapshot();
        }

        return new UserDeviceSnapshot
        {
            Browser = UserAgentParser.ResolveBrowser(ua),
            OS = UserAgentParser.ResolveOs(ua),
            DeviceType = UserAgentParser.ResolveDeviceType(ua),
            UserAgent = ua
        };
    }

    private static string ResolveBrowser(string ua)
    {
        return ua.Contains("Edg", StringComparison.OrdinalIgnoreCase) ? "Edge" :
            ua.Contains("Chrome", StringComparison.OrdinalIgnoreCase) &&
            !ua.Contains("Edg", StringComparison.OrdinalIgnoreCase) ? "Chrome" :
            ua.Contains("Firefox", StringComparison.OrdinalIgnoreCase) ? "Firefox" :
            ua.Contains("Safari", StringComparison.OrdinalIgnoreCase) &&
            !ua.Contains("Chrome", StringComparison.OrdinalIgnoreCase) ? "Safari" :
            UserAgentParser.Unknown;
    }

    private static string ResolveOs(string ua)
    {
        return ua.Contains("Windows", StringComparison.OrdinalIgnoreCase) ? "Windows" :
            ua.Contains("Android", StringComparison.OrdinalIgnoreCase) ? "Android" :
            ua.Contains("iPhone", StringComparison.OrdinalIgnoreCase) ||
            ua.Contains("iPad", StringComparison.OrdinalIgnoreCase) ? "iOS" :
            ua.Contains("Mac OS", StringComparison.OrdinalIgnoreCase) ? "MacOS" :
            ua.Contains("Linux", StringComparison.OrdinalIgnoreCase) ? "Linux" :
            UserAgentParser.Unknown;
    }

    private static string ResolveDeviceType(string ua)
    {
        return ua.Contains("Mobile", StringComparison.OrdinalIgnoreCase) ? "Mobile" :
            ua.Contains("Tablet", StringComparison.OrdinalIgnoreCase) ? "Tablet" :
            "Desktop";
    }
}