namespace Hukaa.Application.DTOs.Wrappers;

public class ResponseDto<T>
{
    public bool Success { get; set; }
    public int StatusCode { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public List<string>? Errors { get; set; }

    public static ResponseDto<T> OkResponse(
        string message,
        T data)
    {
        return new ResponseDto<T>
        {
            Success = true,
            Message = message,
            Data = data,
            StatusCode = StatusCodes.Status200OK
        };
    }

    public static ResponseDto<T> FailResponse(
        string message,
        int statusCode = StatusCodes.Status400BadRequest,
        List<string>? errors = null)
    {
        return new ResponseDto<T>
        {
            Success = false,
            Message = message,
            StatusCode = statusCode,
            Errors = errors
        };
    }

    public static ResponseDto<T> CreatedResponse(
        string message,
        T data)
    {
        return new ResponseDto<T>
        {
            Success = true,
            Message = message,
            Data = data,
            StatusCode = StatusCodes.Status201Created
        };
    }
}

// T olmadan istifadə üçün
public class ResponseDto : ResponseDto<object>
{
    public static ResponseDto OkResponse(string message)
    {
        return new ResponseDto
        {
            Success = true,
            Message = message,
            StatusCode = StatusCodes.Status200OK
        };
    }

    public new static ResponseDto FailResponse(
        string message,
        int statusCode = StatusCodes.Status400BadRequest,
        List<string>? errors = null)
    {
        return new ResponseDto
        {
            Success = false,
            Message = message,
            StatusCode = statusCode,
            Errors = errors
        };
    }

    public new static ResponseDto CreatedResponse(
        string message,
        object? data = null)
    {
        return new ResponseDto
        {
            Success = true,
            Message = message,
            Data = data,
            StatusCode = StatusCodes.Status201Created
        };
    }
}