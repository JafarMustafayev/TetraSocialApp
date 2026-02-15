namespace Hukaa_back.Exceptions;

public abstract class AppException : Exception
{
    public int StatusCode { get; }
    public IReadOnlyList<string> Errors { get; }

    protected AppException(
        string message,
        int statusCode,
        IReadOnlyList<string>? errors = null
    ) : base(message)
    {
        StatusCode = statusCode;
        Errors = errors ?? [];
    }
}