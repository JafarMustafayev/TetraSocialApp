namespace Hukaa.Infrastructure.Common;

public class TokenHasher : ITokenHasher
{
    public string Hash(string token, string secretKey)
    {
        var keyBytes = Encoding.UTF8.GetBytes(secretKey);
        var tokenBytes = Encoding.UTF8.GetBytes(token);
        using var hmac = new HMACSHA256(keyBytes);
        var hashBytes = hmac.ComputeHash(tokenBytes);
        return Convert.ToBase64String(hashBytes);
    }
}