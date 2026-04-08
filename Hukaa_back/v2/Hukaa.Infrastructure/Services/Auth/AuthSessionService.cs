using Hukaa.Application.Abstractions.Repositories.AuthSessionRepos;

namespace Hukaa.Infrastructure.Services.Auth;

public class AuthSessionService(
    IAuthSessionReadRepository readRepo,
    IAuthSessionWriteRepository writeRepo,
    IUnitOfWork unitOfWork) : IAuthSessionService
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
        //todo: IP, location, device info datalarini topla 

        var session = new AuthSession
        {
            UserId = userId,
            CreatedByIp = "127.0.0.1" //todo: ip servisini elave etdikden sonra deyis
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