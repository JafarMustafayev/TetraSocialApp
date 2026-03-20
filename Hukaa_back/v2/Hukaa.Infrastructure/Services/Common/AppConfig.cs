namespace Hukaa.Infrastructure.Services.Common;

public class AppConfig(IConfiguration configuration) : IAppConfig
{
    public T GetSection<T>(string? section = null) where T : class, new()
    {
        section ??= typeof(T).Name;

        var configSection = configuration.GetSection(section);
        if(!configSection.Exists())
        {
            throw new InvalidOperationException($"Config section '{section}' not found.");
        }

        var result = new T();
        configSection.Bind(result);

        return result;
    }
}