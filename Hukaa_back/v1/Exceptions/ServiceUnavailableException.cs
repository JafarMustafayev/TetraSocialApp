namespace Hukaa_back.Exceptions;

public sealed class ServiceUnavailableException : AppException
{
    public ServiceUnavailableException(string message = "Service unavailable", IReadOnlyList<string>? errors = null)
        : base(message, StatusCodes.Status503ServiceUnavailable, errors)
    {
    }
}