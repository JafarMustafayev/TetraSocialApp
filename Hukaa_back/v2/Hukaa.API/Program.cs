var builder = WebApplication.CreateBuilder(args);

builder.Services.AppServiceCollections(builder.Configuration);

var app = builder.Build();

app.ConfigureApp();
app.MapControllers();
app.Run();