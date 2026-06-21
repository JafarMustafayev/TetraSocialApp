namespace Tetra.Application.Abstractions.Common;

public interface IJwtClaimsReader
{
    string GetUserId();
    string GetSessionId();
    List<string> GetRoles();
    string GetClaim(string claimType);
}