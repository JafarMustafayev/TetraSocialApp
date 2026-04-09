namespace Hukaa.Application.Abstractions.Common;

public interface IClientIpResolver
{
    string GetClientIpV4();
    string GetClientIpV6();
}