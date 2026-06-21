namespace Tetra.Application.Exceptions;

public class ForbiddenException : AppException
{
    public ForbiddenException(
        string message = "Forbidden"
    ) : base(message, StatusCodes.Status403Forbidden)
    {
    }

    public ForbiddenException(
        string message,
        IReadOnlyList<string> errors
    ) : base(message, StatusCodes.Status403Forbidden, errors)
    {
    }
}