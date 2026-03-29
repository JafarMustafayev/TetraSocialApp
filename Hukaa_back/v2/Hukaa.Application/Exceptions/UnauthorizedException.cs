namespace Hukaa.Application.Exceptions;

public class UnauthorizedException : AppException
{
    public UnauthorizedException(
        string message = "Unauthorized")
        : base(message, StatusCodes.Status401Unauthorized)
    {
    }

    public UnauthorizedException(
        string message,
        IReadOnlyList<string> errors)
        : base(message, StatusCodes.Status401Unauthorized, errors)
    {
    }
}