namespace Hukaa.Application.Exceptions;

public class BadRequestException : AppException
{
    public BadRequestException(
        string message = "Bad request") : base(message, StatusCodes.Status400BadRequest)
    {
    }

    public BadRequestException(
        string message,
        IReadOnlyList<string> errors)
        : base(message, StatusCodes.Status400BadRequest, errors)
    {
    }
}