namespace Hukaa.Infrastructure.Common;

public class JwtClaimsReader(
    IHttpContextAccessor accessor,
    ILocalizationService localizer) : IJwtClaimsReader
{
    public string GetUserId()
    {
        var userId = GetClaimValue(ClaimTypes.NameIdentifier);

        if(string.IsNullOrWhiteSpace(userId))
        {
            throw new UnauthorizedException(localizer.Get("Error.Unauthorized.MissingUserId"));
        }

        return userId;
    }

    public string GetSessionId()
    {
        var sessionId = GetClaimValue("sessionId");

        if(string.IsNullOrWhiteSpace(sessionId))
        {
            throw new UnauthorizedException(localizer.Get("Error.Unauthorized.MissingSessionId"));
        }

        return sessionId;
    }

    public List<string> GetRoles()
    {
        var roles = GetClaimValues("roles");
        if(roles == null || roles.Count == 0)
        {
            throw new UnauthorizedException(localizer.Get("Error.Unauthorized.MissingRoles"));
        }

        return roles;
    }

    public string GetClaim(string claimType)
    {
        var value = GetClaimValue(claimType);

        if(string.IsNullOrWhiteSpace(value))
        {
            throw new BadRequestException(localizer.Get("Validation.Common.OperationFailed"));
        }

        return value;
    }

    private string? GetClaimValue(string claimType)
    {
        return accessor.HttpContext!
            .User.FindFirstValue(claimType);
    }

    private List<string>? GetClaimValues(string claimType)
    {
        return accessor.HttpContext?.User?
            .FindAll(claimType)
            .Select(c => c.Value)
            .ToList() ?? new List<string>();
    }
}