namespace Tetra.Application.Exceptions;

public class ValidationException : AppException
{
    public ValidationException(
        string message = "One or more validation errors occurred") : base(message, StatusCodes.Status400BadRequest)
    {
    }

    public ValidationException(
        string message = "One or more validation errors occurred",
        IReadOnlyList<string>? errors = null) : base(message, StatusCodes.Status400BadRequest, errors)
    {
    }
}