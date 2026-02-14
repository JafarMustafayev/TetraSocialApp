namespace Hukaa_back.Exceptions;

public sealed class SecurityException : AppException
{
    public SecurityException(string message, IReadOnlyList<string>? errors = null)
        : base(message, StatusCodes.Status403Forbidden, errors)
    {
    }
}
