namespace Hukaa.Application.Abstractions.Common;

public interface IUserAgentParser
{
    UserDeviceSnapshot Parse();
}