namespace Hukaa_back.ConfigurationModels;

public class ApplicationUrlParameters
{
    public string BackEndApplicationUrl { get; set; }  = string.Empty;
    public string FrontEndApplicationUrl { get; set; }  = string.Empty;
    public string EmailConfirmationUrl { get; set; } = string.Empty;
}
