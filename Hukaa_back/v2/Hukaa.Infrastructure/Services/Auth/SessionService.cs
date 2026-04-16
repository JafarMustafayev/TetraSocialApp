namespace Hukaa.Infrastructure.Services.Auth;

public class SessionService(
    IAuthSessionReadRepository readRepo,
    IAuthSessionWriteRepository writeRepo,
    IUnitOfWork unitOfWork,
    IClientIpResolver ipResolver,
    IUserAgentParser agentParser,
    ITokenService tokenService,
    ILocalizationService localizer) : ISessionService
{
    public async Task<string> CreateSessionAsync(string userId)
    {
        //todo: location datalarini topla 

        var session = new AuthSession
        {
            UserId = userId,
            CreatedByIp = ipResolver.GetClientIpV4(),
            UserAgent = JsonSerializer.Serialize(
                agentParser.Parse())
        };

        await writeRepo.AddAsync(session);
        await unitOfWork.SaveChangesAsync();
        return session.Id;
    }

    public async Task<ResponseDto> RevokeSessionAsync(string sessionId)
    {
        var session = await readRepo.FirstOrDefaultAsync(s => s.Id == sessionId);
        if(session == null)
        {
            throw new NotFoundException(localizer.Get("Error.Session.Get.NotFound"));
        }

        session.Revoke(ipResolver.GetClientIpV4());
        writeRepo.Update(session);
        await unitOfWork.SaveChangesAsync();

        await tokenService.RevokeRefreshTokenBySessionIdAsync(sessionId);

        return ResponseDto.OkResponse(localizer.Get("Auth.Session.Success.Revoked"));
    }
}