namespace Hukaa_back.Abstractions.Services.Auth;

public interface IRegistrationService
{
    Task<object> RegisterAsync(RegisterRequestDto request);
    Task<ResponseDto> ConfirmEmailAsync(ConfirmEmailDto request);
}
