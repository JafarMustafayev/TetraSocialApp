namespace Hukaa.Application.Exceptions;

public class AppException : Exception
{
    public string Message { get; set; }
    public int StatusCode { get; set; }
    public IReadOnlyCollection<string>? Errors { get; set; }

    public AppException(
        string message,
        int statusCode,
        IReadOnlyList<string>? errors = null
    ) : base(message)
    {
        Message = message;
        StatusCode = statusCode;
        Errors = errors ?? [];
    }
}