namespace Tetra.Application.Abstractions.Services.Client;

public interface IClientUrlService
{
    string BuildEmailConfirmationUrl(string userId, string token);
    string BuildPasswordResetUrl(string userId, string token);
    string EncodeToUrl(string plainText);
    string DecodeFromUrl(string encodedText);
}