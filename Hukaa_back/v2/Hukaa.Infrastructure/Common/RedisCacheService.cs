namespace Hukaa.Infrastructure.Common;

public sealed class RedisCacheService(
    IConnectionMultiplexer redis,
    ILocalizationService localizer) : IRedisCacheService
{
    private readonly IDatabase _database = redis.GetDatabase();

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public async Task<T?> GetAsync<T>(string key)
    {
        EnsureKeyIsNotEmpty(key);
        var value = await _database.StringGetAsync(key);

        if(value.IsNullOrEmpty)
        {
            return default;
        }

        return JsonSerializer.Deserialize<T>(value.ToString(), RedisCacheService.JsonOptions);
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null)
    {
        EnsureKeyIsNotEmpty(key);
        var serializedValue = JsonSerializer.Serialize(value, RedisCacheService.JsonOptions);
        await _database.StringSetAsync(key, (RedisValue)serializedValue, expiration, When.Always);
    }

    public async Task<bool> ExistsAsync(string key)
    {
        EnsureKeyIsNotEmpty(key);
        return await _database.KeyExistsAsync(key);
    }

    public async Task RemoveAsync(string key)
    {
        EnsureKeyIsNotEmpty(key);
        await _database.KeyDeleteAsync(key);
    }

    public async Task RemoveByPatternAsync(string pattern)
    {
        EnsureKeyIsNotEmpty(pattern, "Error.Cache.Pattern.Required");

        var endpoints = redis.GetEndPoints();

        foreach (var endpoint in endpoints)
        {
            var server = redis.GetServer(endpoint);
            if(!server.IsConnected)
            {
                continue;
            }

            foreach (var key in server.Keys(pattern: pattern))
            {
                await _database.KeyDeleteAsync(key);
            }
        }
    }

    public async Task<Dictionary<string, T>> GetByPatternAsync<T>(string pattern)
    {
        EnsureKeyIsNotEmpty(pattern, "Error.Cache.Pattern.Required");

        var result = new Dictionary<string, T>();

        var endpoints = redis.GetEndPoints();

        foreach (var endpoint in endpoints)
        {
            var server = redis.GetServer(endpoint);

            if(!server.IsConnected)
            {
                continue;
            }

            var keys = server.Keys(pattern: pattern).ToArray();

            if(keys.Length == 0)
            {
                continue;
            }

            foreach (var key in keys)
            {
                var value = await _database.StringGetAsync(key);

                if(value.IsNullOrEmpty)
                {
                    continue;
                }

                var item = JsonSerializer.Deserialize<T>(value.ToString(), RedisCacheService.JsonOptions);

                if(item != null)
                {
                    result[key] = item;
                }
            }
        }

        return result;
    }

    public async Task<T?> GetOrSetAsync<T>(string key, Func<Task<T?>> factory, TimeSpan? expiration = null)
    {
        EnsureKeyIsNotEmpty(key);
        ArgumentNullException.ThrowIfNull(factory);

        var cachedValue = await GetAsync<T>(key);

        if(cachedValue is not null)
        {
            return cachedValue;
        }

        var newValue = await factory();

        if(newValue is null)
        {
            return default;
        }

        await SetAsync(key, newValue, expiration);

        return newValue;
    }

    public async Task<TimeSpan?> GetTimeToLiveAsync(string key)
    {
        EnsureKeyIsNotEmpty(key);
        return await _database.KeyTimeToLiveAsync(key);
    }

    public async Task<bool> RefreshExpirationAsync(string key, TimeSpan expiration)
    {
        EnsureKeyIsNotEmpty(key);
        if(expiration <= TimeSpan.Zero)
        {
            throw new ConflictException(localizer.Get("Error.Cache.Expiration.Invalid"));
        }

        return await _database.KeyExpireAsync(key, expiration);
    }

    private void EnsureKeyIsNotEmpty(string key, string localizationMessageKey = "Error.Cache.Key.Required")
    {
        if(string.IsNullOrWhiteSpace(key))
        {
            throw new ConflictException(localizer.Get(localizationMessageKey));
        }
    }
}