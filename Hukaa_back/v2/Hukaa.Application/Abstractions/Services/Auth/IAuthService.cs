namespace Hukaa.Application.Abstractions.Services.Auth;

public interface IAuthService
{
    public Task<ResponseDto> RegisterAsync(RegisterRequestDto request);
    public Task<JwtTokenResponse> LoginAsync(LoginRequestDto request);
}