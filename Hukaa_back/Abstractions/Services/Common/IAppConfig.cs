namespace Hukaa_back.Abstractions.Services.Common;

public interface IAppConfig
{
    T GetSection<T>(string? section = null) where T : class, new();
    string GetConnectionString(string name = "DefaultConnection");
}
