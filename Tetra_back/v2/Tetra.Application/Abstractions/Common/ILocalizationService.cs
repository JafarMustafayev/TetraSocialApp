namespace Tetra.Application.Abstractions.Common;

public interface ILocalizationService
{
    string Get(string key,
        string? propertyName = null,
        Dictionary<string, object>? parameters = null);
}