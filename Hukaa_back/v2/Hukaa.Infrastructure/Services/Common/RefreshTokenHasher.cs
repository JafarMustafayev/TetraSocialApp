namespace Hukaa.Infrastructure.Services.Common;

public class RefreshTokenHasher : IRefreshTokenHasher
{
    public string Hash(string refreshToken, string secretKey)
    {
        var keyBytes = Encoding.UTF8.GetBytes(secretKey);
        var tokenBytes = Encoding.UTF8.GetBytes(refreshToken);
        using var hmac = new HMACSHA256(keyBytes);
        var hashBytes = hmac.ComputeHash(tokenBytes);
        return Convert.ToBase64String(hashBytes);
    }
}