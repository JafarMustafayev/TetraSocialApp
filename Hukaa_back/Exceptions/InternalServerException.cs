namespace Hukaa_back.Exceptions;

public sealed class InternalServerException : AppException
{
    public InternalServerException(string message = "Internal server error", IReadOnlyList<string>? errors = null)
        : base(message, StatusCodes.Status500InternalServerError, errors)
    {
    }
}
