namespace Hukaa_back.Abstractions.Services.Auth;

public interface IAuthService
{
    public Task<ResponseDto> LoginAsync(LoginRequestDto request);
}
