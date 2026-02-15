namespace Hukaa_back.Exceptions;

public sealed class ExternalServiceException : AppException
{
    public ExternalServiceException(string serviceName, IReadOnlyList<string>? errors = null)
        : base(
            $"{serviceName} service is unavailable",
            StatusCodes.Status502BadGateway, errors)
    {
    }
}