namespace Tetra.Application.Abstractions.Common;

public interface ITokenHasher
{
    string Hash(string token, string secretKey);
}