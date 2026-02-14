namespace Hukaa_back.Exceptions;

public sealed class UnauthorizedException : AppException
{
    public UnauthorizedException(string message = "Unauthorized", IReadOnlyList<string>? errors = null)
        : base(message, StatusCodes.Status401Unauthorized, errors)
    {
    }
}
