namespace Hukaa.Infrastructure.Services.Common;

public class LocalizationService(
    IStringLocalizer<SharedResource> localizer
) : ILocalizationService
{
    public string Get(string key)
    {
        return localizer.GetString(key);
    }
}