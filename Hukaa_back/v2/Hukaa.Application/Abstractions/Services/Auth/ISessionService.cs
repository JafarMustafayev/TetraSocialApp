namespace Hukaa.Application.Abstractions.Services.Auth;

public interface ISessionService
{
    Task<string> CreateSessionAsync(string userId);

    //Task<ResponseDto> GetSessionByIdAsync(string sessionId);
    //ResponseDto GetMyActiveSessions();
    Task<ResponseDto> RevokeSessionAsync(string sessionId);
    //Task<ResponseDto> RevokeAllExceptCurrentAsync(string currentSessionId);
    //Task<ResponseDto> RevokeAllSessionsAsync();
    //void RevokeOldestSession(); // ★ limitə çatdıqda
}