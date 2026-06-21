namespace Tetra.Application.Abstractions.Services.Auth;

public interface ISessionService
{
    Task<string> CreateSessionAsync(string userId);
    ResponseDto<object> GetMyActiveSessions();
    Task<ResponseDto> RevokeSessionAsync(string sessionId, bool ifLoggingOut = false);
    Task<ResponseDto> RevokeAllExceptCurrentAsync();
    Task RevokeAllSessionsAsync(string? userId);
    Task RevokeOldestSessionsAsync(ICollection<AuthSession> sessions);
    Task<bool> ExistsActiveAsync(string sessionId);
    Task UpdateLastActivityAsync(string sessionId);
}