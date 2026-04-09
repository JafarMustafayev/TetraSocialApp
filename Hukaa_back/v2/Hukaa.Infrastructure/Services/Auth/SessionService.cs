namespace Hukaa.Infrastructure.Services.Auth;

public class SessionService(
    IAuthSessionReadRepository readRepo,
    IAuthSessionWriteRepository writeRepo,
    IUnitOfWork unitOfWork,
    IClientIpResolver ipResolver,
    IUserAgentParser agentParser) : ISessionService
{
    public ResponseDto GetMyActiveSessions()
    {
        throw new NotImplementedException();
    }

    public Task<ResponseDto> GetUserSessionByIdAsync(string sessionId)
    {
        throw new NotImplementedException();
    }

    public async Task<string> CreateSessionAsync(string userId)
    {
        //todo: location datalarini topla 

        var session = new AuthSession
        {
            UserId = userId,
            CreatedByIp = ipResolver.GetClientIpV4(),
            DeviceInfo = JsonSerializer.Serialize(
                agentParser.Parse())
        };

        await writeRepo.AddAsync(session);
        await unitOfWork.SaveChangesAsync();
        return session.Id;
    }

    public Task<ResponseDto> RevokeSessionAsync(string sessionId)
    {
        throw new NotImplementedException();
    }

    public Task<ResponseDto> RevokeAllSessionsAsync()
    {
        throw new NotImplementedException();
    }
}