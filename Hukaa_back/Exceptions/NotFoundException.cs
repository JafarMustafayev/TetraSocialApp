namespace Hukaa_back.Exceptions;

public sealed class NotFoundException : AppException
{
    public NotFoundException(string resourceName, object key)
        : base(
            $"{resourceName} not found",
            StatusCodes.Status404NotFound,
            [$"{resourceName} with key '{key}' was not found"])
    {
    }
}
