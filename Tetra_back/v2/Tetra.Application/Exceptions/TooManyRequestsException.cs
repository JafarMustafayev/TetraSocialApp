namespace Tetra.Application.Exceptions;

public class TooManyRequestsException : AppException
{
    public TooManyRequestsException(
        string message = "Too many requests")
        : base(message, StatusCodes.Status429TooManyRequests)
    {
    }

    public TooManyRequestsException(
        string message,
        IReadOnlyList<string> errors)
        : base(message, StatusCodes.Status429TooManyRequests, errors)
    {
    }
}