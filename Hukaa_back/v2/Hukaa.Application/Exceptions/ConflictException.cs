namespace Hukaa.Application.Exceptions;

public class ConflictException : AppException
{
    public ConflictException(
        string message = "Conflict occurred")
        : base(message, StatusCodes.Status409Conflict)
    {
    }

    public ConflictException(
        string message,
        IReadOnlyList<string> errors)
        : base(message, StatusCodes.Status409Conflict, errors)
    {
    }
}