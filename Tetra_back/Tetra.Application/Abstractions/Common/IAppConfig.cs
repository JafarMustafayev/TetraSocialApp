namespace Tetra.Application.Abstractions.Common;

public interface IAppConfig
{
    T GetSection<T>(string? section = null) where T : class, new();
}