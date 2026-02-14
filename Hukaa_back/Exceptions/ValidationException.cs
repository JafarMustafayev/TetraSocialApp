namespace Hukaa_back.Exceptions;

public sealed class ValidationException : AppException
{
    public ValidationException(string? message = "Validation failed", IReadOnlyList<string>? errors = null)
        : base(
            message,
            StatusCodes.Status400BadRequest,
            errors)
    {
    }
}
