namespace Hukaa_back.Exceptions;

public sealed class BadRequestException : AppException
{
    public BadRequestException(string message, IReadOnlyList<string>? errors = null)
        : base(message, StatusCodes.Status400BadRequest, errors)
    {
    }
}