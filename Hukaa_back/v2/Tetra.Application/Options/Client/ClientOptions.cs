namespace Tetra.Application.Options.Client;

public class ClientOptions
{
    public string BaseUrl { get; set; } = string.Empty;
    public ClientUrlPaths Paths { get; set; } = new();

}