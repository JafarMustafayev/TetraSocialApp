namespace Hukaa_back.Exceptions;

public sealed class ForbiddenException : AppException
{
    public ForbiddenException(string message = "Access denied", IReadOnlyList<string>? errors = null)
        : base(message, StatusCodes.Status403Forbidden, errors)
    {
    }
}
