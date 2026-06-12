namespace Hukaa.Infrastructure.Services.Auth;

public class SessionService(
    IMapper mapper,
    IAppConfig appConfig,
    IJwtClaimsReader jwtClaimsReader,
    IAuthSessionReadRepository readRepo,
    IAuthSessionWriteRepository writeRepo,
    IUnitOfWork unitOfWork,
    IClientIpResolver ipResolver,
    IUserAgentParser agentParser,
    IAuthTokenService authTokenService,
    ILocalizationService localizer) : ISessionService
{

    private readonly SessionBusinessRulesOptions _sessionBusinessRulesOptions =
        appConfig.GetSection<BusinessRulesOptions>().Session;

    public ResponseDto<object> GetMyActiveSessions()
    {
        var userId = jwtClaimsReader.GetUserId();
        var currentSessionId = jwtClaimsReader.GetSessionId();

        var sessions = readRepo
            .Where(x => x.UserId == userId && !x.IsRevoked)
            .ToList();

        var mapped = mapper.Map<List<UserSessionListItemDto>>(sessions);

        mapped.ForEach(x =>
        {
            x.IsCurrent = x.Id == currentSessionId;
        });

        mapped = mapped
            .OrderByDescending(x => x.IsCurrent)
            .ThenByDescending(x => x.LastActivityAt)
            .ToList();

        return ResponseDto<object>.OkResponse(
            localizer.Get("Session.GetActiveSessions.Success"),
            mapped);
    }
    public async Task<string> CreateSessionAsync(string userId)
    {
        var activeSessionCount = await readRepo.CountAsync(x =>
            x.UserId == userId &&
            !x.IsRevoked);

        if(activeSessionCount >= _sessionBusinessRulesOptions.MaxActiveSessionsPerUser)
        {
            if(!_sessionBusinessRulesOptions.RevokeOldestSessionWhenLimitExceeded)
            {
                throw new BadRequestException(
                    localizer.Get("Error.Session.MaxActiveSessionsPerUser"));
            }

            var activeSessions = readRepo
                .Where(x => x.UserId == userId && !x.IsRevoked)
                .ToList();

            await RevokeOldestSessionsAsync(activeSessions);
        }

        var parsedUserAgent = agentParser.Parse();

        var deviceInfo = new
        {
            parsedUserAgent.DeviceType,
            parsedUserAgent.OS,
            parsedUserAgent.Browser
        };

        var session = new AuthSession
        {
            UserId = userId,
            CreatedByIp = ipResolver.GetClientIpV4(),
            UserAgent = parsedUserAgent.UserAgent,
            DeviceInfo = JsonSerializer.Serialize(deviceInfo),
            LastActivityAt = DateTime.UtcNow
        };

        await writeRepo.AddAsync(session);
        await unitOfWork.SaveChangesAsync();

        return session.Id;
    }
    public async Task<ResponseDto> RevokeSessionAsync(string sessionId)
    {
        var userId = jwtClaimsReader.GetUserId();
        var currentSessionId = jwtClaimsReader.GetSessionId();

        var session = await readRepo.FirstOrDefaultAsync(s =>
            s.Id == sessionId &&
            s.UserId == userId &&
            !s.IsRevoked);

        if(session == null)
        {
            throw new NotFoundException(localizer.Get("Error.Session.Get.NotFound"));
        }

        if(session.Id == currentSessionId)
        {
            throw new BadRequestException(localizer.Get("Error.Session.CannotRevokeCurrent"));
        }

        session.Revoke(ipResolver.GetClientIpV4());
        writeRepo.Update(session);
        await unitOfWork.SaveChangesAsync();

        await authTokenService.RevokeRefreshTokenBySessionIdAsync(sessionId);

        return ResponseDto.OkResponse(localizer.Get("Auth.Session.Success.Revoked"));
    }
    public async Task<ResponseDto> RevokeAllExceptCurrentAsync()
    {
        var sessionId = jwtClaimsReader.GetSessionId();
        var userId = jwtClaimsReader.GetUserId();
        var sessions =
            readRepo.Where(x =>
                x.UserId == userId &&
                x.Id != sessionId &&
                !x.IsRevoked).ToList();

        sessions.ForEach(x => x.Revoke(ipResolver.GetClientIpV4()));
        writeRepo.UpdateRange(sessions);
        await unitOfWork.SaveChangesAsync();

        return ResponseDto.OkResponse(localizer.Get("Auth.Session.Success.Revoked"));
    }
    public async Task RevokeAllSessionsAsync(string? userId = null)
    {
        userId = string.IsNullOrWhiteSpace(userId)
            ? jwtClaimsReader.GetUserId()
            : userId;

        var sessions = readRepo.Where(x => x.UserId == userId).ToList();

        sessions.ForEach(x => x.Revoke(ipResolver.GetClientIpV4()));
        writeRepo.UpdateRange(sessions);
        await unitOfWork.SaveChangesAsync();
    }
    public async Task RevokeOldestSessionsAsync(ICollection<AuthSession> sessions)
    {
        var revokeCount = sessions.Count() - _sessionBusinessRulesOptions.MaxActiveSessionsPerUser + 1;
        var revokeSessions = sessions
            .OrderBy(x => x.LastActivityAt)
            .Take(revokeCount).ToList();

        revokeSessions.ForEach(x => x.Revoke(ipResolver.GetClientIpV4()));
        writeRepo.UpdateRange(revokeSessions);
        await unitOfWork.SaveChangesAsync();
    }
    public async Task<bool> ExistsActiveAsync(string sessionId)
    {
        var session = await readRepo.FirstOrDefaultAsync(x =>
            x.Id == sessionId &&
            !x.IsRevoked);

        return session != null;
    }
    public async Task UpdateLastActivityAsync(string sessionId)
    {
        var session = await readRepo.FirstOrDefaultAsync(x => x.Id == sessionId);
        if(session == null)
        {
            return;
        }

        session.LastActivityAt = DateTime.UtcNow;
        writeRepo.Update(session);
        await unitOfWork.SaveChangesAsync();
    }
}