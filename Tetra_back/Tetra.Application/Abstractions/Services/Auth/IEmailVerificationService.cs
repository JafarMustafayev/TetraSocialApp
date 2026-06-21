namespace Tetra.Application.Abstractions.Services.Auth;

public interface IEmailVerificationService
{
    Task<ResponseDto> ConfirmAsync(ConfirmEmailRequestDto request);

    Task<ResponseDto<object>> ResendConfirmationAsync(ResendEmailConfirmationRequestDto request);
}