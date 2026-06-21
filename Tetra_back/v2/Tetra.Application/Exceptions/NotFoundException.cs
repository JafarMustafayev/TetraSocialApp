namespace Tetra.Application.Exceptions;

public class NotFoundException : AppException
{
    public NotFoundException(
        string message = "Resource not found")
        : base(message, StatusCodes.Status404NotFound)
    {
    }

    public NotFoundException(
        string message,
        IReadOnlyList<string> errors)
        : base(message, StatusCodes.Status404NotFound, errors)
    {
    }
}