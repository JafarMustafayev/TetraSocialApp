namespace Hukaa.Application.Abstractions.Services.Auth;

public interface IAuthSessionService
{
    public ResponseDto GetMyActiveSessions();

    public Task<ResponseDto> GetUserSessionByIdAsync(string sessionId);

    public Task<string> CreateSessionAsync(string userId);

    public Task<ResponseDto> RevokeSessionAsync(string sessionId);

    public Task<ResponseDto> RevokeAllSessionsAsync();
}