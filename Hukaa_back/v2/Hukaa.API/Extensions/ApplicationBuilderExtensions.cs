namespace Hukaa.API.Extensions;

public static class ApplicationBuilderExtensions
{
    extension(IApplicationBuilder app)
    {
        public void ConfigureApp()
        {
            app.UseHttpsRedirection();
            app.UseAuthorization();
        }
    }
}