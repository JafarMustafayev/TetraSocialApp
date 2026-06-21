namespace Tetra.Infrastructure.Common;

public class LocalizationService(
    IStringLocalizer<SharedResource> localizer
) : ILocalizationService
{
    private static readonly Regex PlaceholderRegex = new(@"\{(\w+)\}", RegexOptions.Compiled);

    public string Get(
        string key,
        string? propertyName = null,
        Dictionary<string, object>? parameters = null)
    {
        string message = localizer.GetString(key);

        var values = new Dictionary<string, object>(StringComparer.OrdinalIgnoreCase);

        if(!string.IsNullOrWhiteSpace(propertyName))
        {
            values["PropertyName"] = propertyName;
        }

        if(parameters is not null)
        {
            foreach (var parameter in parameters)
            {
                values[parameter.Key] = parameter.Value;
            }
        }

        return LocalizationService.PlaceholderRegex.Replace(message, match =>
        {
            var placeholder = match.Groups[1].Value;

            return values.TryGetValue(placeholder, out var value)
                ? value?.ToString() ?? string.Empty
                : match.Value;
        });
    }
}