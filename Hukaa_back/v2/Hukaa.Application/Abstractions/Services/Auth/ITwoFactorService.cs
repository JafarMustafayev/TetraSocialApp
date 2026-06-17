namespace Hukaa.Application.Abstractions.Services.Auth;

public interface ITwoFactorService
{
    Task<ResponseDto<TwoFactorStatusResponseDto>> GetStatusAsync();

}