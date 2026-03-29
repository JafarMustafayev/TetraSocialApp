namespace Hukaa.Application.DTOs.Wrappers;

public class ResponseDto<T>
{
    public bool Success { get; set; }
    public int StatusCode { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public List<string>? Errors { get; set; }

    public static ResponseDto<T> OkResponse(T data, string message)
    {
        return new ResponseDto<T>
        {
            Success = true,
            Message = message,
            Data = data,
            StatusCode = 200
        };
    }

    public static ResponseDto<T> FailResponse(string message, int statusCode = 400, List<string>? errors = null)
    {
        return new ResponseDto<T>
        {
            Success = false,
            Message = message,
            StatusCode = statusCode,
            Errors = errors
        };
    }

    public static ResponseDto<T> CreatedResponse(T data, string message)
    {
        return new ResponseDto<T>
        {
            Success = true,
            Message = message,
            Data = data,
            StatusCode = 201
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
            StatusCode = 200
        };
    }

    public new static ResponseDto FailResponse(string message, int statusCode = 400, List<string>? errors = null)
    {
        return new ResponseDto
        {
            Success = false,
            Message = message,
            StatusCode = statusCode,
            Errors = errors
        };
    }

    public new static ResponseDto CreatedResponse(object data, string message)
    {
        return new ResponseDto
        {
            Success = true,
            Message = message,
            Data = data,
            StatusCode = 201
        };
    }
}