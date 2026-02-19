namespace Hukaa_back.Middlewares;

public sealed class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        ResponseDto response;

        if (exception is AppException appException)
        {
            response = new ResponseDto
            {
                Success = false,
                StatusCode = appException.StatusCode,
                Message = appException.Message,
                Errors = appException.Errors
            };

            context.Response.StatusCode = appException.StatusCode;
        }
        else
        {
            response = new ResponseDto
            {
                Success = false,
                StatusCode = 500,
                Message = "Internal Server Error",
                Errors = [exception.Message]
            };

            context.Response.StatusCode = 500;
        }

        context.Response.ContentType = "application/json";

        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}