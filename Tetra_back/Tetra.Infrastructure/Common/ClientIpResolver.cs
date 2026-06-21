namespace Tetra.Infrastructure.Common;

public class ClientIpResolver(
    IHttpContextAccessor accessor) : IClientIpResolver
{
    private const string Unknown = "UNKNOWN";
    private const string Localhost = "127.0.0.1";

    public string GetClientIpV4()
    {
        var context = accessor.HttpContext;
        if(context is null)
        {
            return ClientIpResolver.Unknown;
        }

        var ip = ClientIpResolver.GetIpFromHeaders(context) ??
                 context.Connection.RemoteIpAddress?.MapToIPv4().ToString();
        return string.IsNullOrWhiteSpace(ip)
            ? ClientIpResolver.Unknown
            : ClientIpResolver.NormalizeIp(ip);
    }

    public string GetClientIpV6()
    {
        var context = accessor.HttpContext;
        if(context is null)
        {
            return ClientIpResolver.Unknown;
        }

        var ip = ClientIpResolver.GetIpFromHeaders(context) ??
                 context.Connection.RemoteIpAddress?.MapToIPv6().ToString();
        return string.IsNullOrWhiteSpace(ip)
            ? ClientIpResolver.Unknown
            : ClientIpResolver.NormalizeIp(ip);
    }

    private static string? GetIpFromHeaders(HttpContext context)
    {
        string? HeaderIp(string key)
        {
            return context.Request.Headers.TryGetValue(key, out var values)
                ? values.ToString().Split(',').FirstOrDefault()?.Trim()
                : null;
        }

        return HeaderIp("X-Forwarded-For") ?? HeaderIp("X-Real-IP");
    }

    private static string NormalizeIp(string ip)
    {
        return ip == "::1" || ip == "0.0.0.1"
            ? ClientIpResolver.Localhost
            : ip;
    }
}