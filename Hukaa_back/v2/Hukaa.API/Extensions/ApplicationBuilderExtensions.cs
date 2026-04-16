namespace Hukaa.API.Extensions;

public static class ApplicationBuilderExtensions
{
    extension(IApplicationBuilder app)
    {
        public void ConfigureApp()
        {
            app.UseLocalization();
            app.UseHttpsRedirection();
       app.UseAuthentication();
            app.UseAuthorization();
            app.UseCors("CorsPolicy");
        }

        private void UseLocalization()
        {
            var supportedCultures = new[]
            {
                new CultureInfo("en"),
                new CultureInfo("az")
            };

            var localizationOptions = new RequestLocalizationOptions
            {
                DefaultRequestCulture = new RequestCulture("en"),
                SupportedCultures = supportedCultures,
                SupportedUICultures = supportedCultures
            };

            localizationOptions.RequestCultureProviders = new List<IRequestCultureProvider>
            {
                new CustomRequestCultureProvider(async context =>
                {
                    var user = context.User;

                    if(user.Identity?.IsAuthenticated == true)
                    {
                        var userIdClaim = user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

                        if(!string.IsNullOrWhiteSpace(userIdClaim))
                        {
                            var dbContext = context.RequestServices.GetRequiredService<AppDbContext>();

                            var preferredLanguage = await dbContext.Users
                                .Where(x => x.Id == userIdClaim)
                                .Select(x => x.PreferredLanguage)
                                .FirstOrDefaultAsync();

                            if(preferredLanguage == "az" || preferredLanguage == "en")
                            {
                                return new ProviderCultureResult(preferredLanguage,
                                    preferredLanguage);
                            }
                        }
                    }

                    return new ProviderCultureResult("en", "en");
                })
            };

            app.UseRequestLocalization(localizationOptions);
        }
    }
}