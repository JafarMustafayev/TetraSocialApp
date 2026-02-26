namespace Hukaa_back.Services.Common;

public class CurrentUserService(IHttpContextAccessor accessor) : ICurrentUserService
{
    public string? UserId
    {
        get
        {
            var userId = accessor
                             .HttpContext!
                             .User.FindFirstValue(ClaimTypes.NameIdentifier)
                         ?? throw new UnauthorizedException();
            return userId;
        }
    }
}