namespace Tetra.Application.Abstractions.Common;

public interface IRedisCacheService
{
    Task<T?> GetAsync<T>(string key);

    Task<Dictionary<string, T>> GetByPatternAsync<T>(string pattern);

    Task SetAsync<T>(string key, T value, TimeSpan? expiration = null);

    Task<bool> ExistsAsync(string key);

    Task RemoveAsync(string key);

    Task RemoveByPatternAsync(string pattern);

    Task<T?> GetOrSetAsync<T>(string key, Func<Task<T?>> factory, TimeSpan? expiration = null);

    Task<TimeSpan?> GetTimeToLiveAsync(string key);

    Task<bool> RefreshExpirationAsync(string key, TimeSpan expiration);
}