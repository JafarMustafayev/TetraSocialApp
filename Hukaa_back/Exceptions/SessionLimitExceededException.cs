namespace Hukaa_back.Exceptions;

public class SessionLimitExceededException : AppException
{
    public SessionLimitExceededException(IReadOnlyList<string>? errors = null)
        : base("Maximum number of active sessions exceeded.", StatusCodes.Status409Conflict, errors)
    {
    }
}
