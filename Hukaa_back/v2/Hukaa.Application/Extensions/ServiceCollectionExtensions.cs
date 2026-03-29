namespace Hukaa.Application.Extensions;

public static class ServiceCollectionExtensions
{
    extension(IServiceCollection services)
    {
        public void AddApplicationServiceCollection(IConfiguration configuration)
        {
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            services.AddFluentValidation();
            services.AddServices(configuration);
        }

        private void AddServices(IConfiguration configuration)
        {
        }

        private void AddFluentValidation()
        {
            services.AddFluentValidationAutoValidation();
            services.AddFluentValidationClientsideAdapters();
            services.AddValidatorsFromAssemblies(AppDomain.CurrentDomain.GetAssemblies());

            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = context =>
                {
                    var problemDetails = new ValidationProblemDetails(context.ModelState)
                    {
                        Status = StatusCodes.Status400BadRequest,
                        Title = "Validation failed" // default title əvəzinə
                    };

                    var response = new
                    {
                        success = false,
                        statusCode = problemDetails.Status,
                        message = problemDetails.Title,
                        errors = problemDetails.Errors
                    };

                    return new BadRequestObjectResult(response);
                };
            });
        }
    }
}