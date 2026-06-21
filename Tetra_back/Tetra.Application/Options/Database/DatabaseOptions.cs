namespace Tetra.Application.Options.Database;

public class DatabaseOptions
{
    public string SqlServerConnectionString { get; set; } = string.Empty;
    public string RedisConnectionString { get; set; } = string.Empty;
}