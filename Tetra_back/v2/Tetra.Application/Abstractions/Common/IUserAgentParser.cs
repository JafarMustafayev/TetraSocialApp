using Tetra.Application.DTOs.UserDevice;

namespace Tetra.Application.Abstractions.Common;

public interface IUserAgentParser
{
    UserDeviceSnapshot Parse();
}