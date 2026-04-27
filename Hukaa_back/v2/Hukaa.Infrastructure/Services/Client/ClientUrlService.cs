namespace Hukaa.Infrastructure.Services.Client;

public class ClientUrlService(
    IAppConfig appConfig) : IClientUrlService
{
    private readonly ClientOptions _clientOptions = appConfig.GetSection<ClientOptions>();

    public string BuildEmailConfirmationUrl(string userId, string token)
    {
        var encodedUserId = EncodeToUrl(userId);
        var encodedToken = EncodeToUrl(token);
        return
            $"{_clientOptions.BaseUrl}{_clientOptions.Paths.EmailConfirmation}?userId={encodedUserId}&token={encodedToken}";
    }
    public string BuildPasswordResetUrl(string userId, string token)
    {
        var encodedUserId = EncodeToUrl(userId);
        var encodedToken = EncodeToUrl(token);
        return
            $"{_clientOptions.BaseUrl}{_clientOptions.Paths.ResetPassword}?userId={encodedUserId}&token={encodedToken}";
    }
    public string EncodeToUrl(string plainText)
    {
        return System.Web.HttpUtility.UrlEncode(plainText);
    }
    public string DecodeFromUrl(string encodedText)
    {
        return System.Web.HttpUtility.UrlDecode(encodedText);
    }
}