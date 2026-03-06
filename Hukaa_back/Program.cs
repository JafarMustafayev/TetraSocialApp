var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigurationServiceCollections(builder.Configuration);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();
if(app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    using (var scope = app.Services.CreateScope())
    {
        await IdentitySeed.SeedAsync(scope.ServiceProvider);
    }
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseStaticFiles();
app.UseAuthorization();

app.UseCors("CorsPolicy");

app.MapControllers();
app.MapHub<NotificationHub>("/hubs/notification");
app.MapHub<ChatHub>("/hubs/chat");

app.Run();