namespace Hukaa.Infrastructure.Services.Auth;

public class SessionService(
    IAuthSessionReadRepository readRepo,
    IAuthSessionWriteRepository writeRepo,
    IUnitOfWork unitOfWork,
    IClientIpResolver ipResolver,
    IUserAgentParser agentParser) : ISessionService
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
}