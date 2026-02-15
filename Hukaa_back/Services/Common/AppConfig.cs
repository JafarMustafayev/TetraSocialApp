namespace Hukaa_back.Services.Common;

public class AppConfig(IConfiguration configuration) : IAppConfig
{
    public T GetSection<T>(string? section = null) where T : class, new()
    {
        section ??= typeof(T).Name;

        var configSection = configuration.GetSection(section);
        if (!configSection.Exists())
        {
            throw new InvalidOperationException($"Config section '{section}' not found.");
        }

        var result = new T();
        configSection.Bind(result);

        return result;
    }

    public string GetConnectionString(string name = "DefaultConnection")
    {
        var conn = configuration.GetConnectionString(name)
                   ?? configuration.GetSection($"DbConnection:{name}").Value;

        if (string.IsNullOrEmpty(conn))
        {
            throw new InvalidOperationException($"Connection string '{name}' not found.");
        }

        return conn;
    }
}