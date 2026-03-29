var builder = WebApplication.CreateBuilder(args);

builder.Services.AppServiceCollections(builder.Configuration);

var app = builder.Build();
if(app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        await RoleSeed.SeedAsync(scope.ServiceProvider);
    }
}

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.ConfigureApp();
app.MapControllers();
app.Run();