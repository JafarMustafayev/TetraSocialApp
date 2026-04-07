namespace Hukaa.Application.Abstractions.Common;

public interface IRefreshTokenHasher
{
    string Hash(string refreshToken, string secretKey);
}