namespace Hukaa_back.DTOs.Common;

public record ResponseDto
{
    public bool Success { get; set; }
    public int StatusCode { get; set; }
    public string Message { get; set; } = string.Empty;
    public object? Data { get; set; }
    public IReadOnlyList<string>? Errors { get; set; }
}