namespace Hukaa_back.Exceptions;

public sealed class ConflictException : AppException
{
    public ConflictException(string message, IReadOnlyList<string>? errors = null)
        : base(message, StatusCodes.Status409Conflict, errors)
    {
    }
}
