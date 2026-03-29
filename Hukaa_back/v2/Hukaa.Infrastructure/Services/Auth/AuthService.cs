namespace Hukaa.Infrastructure.Services.Auth;

public class AuthService(
    UserManager<User> userManager,
    SignInManager<User> signInManager,
    RoleManager<Role> roleManager,
    IAppConfig appConfig,
    IMapper mapper,
    ILocalizationService localizer
) : IAuthService
{
    public async Task<ResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        if(await userManager.FindByNameAsync(request.Username) != null)
        {
            throw new ConflictException(localizer.Get("Validation.Common.AlreadyExists", "Username"));
        }

        if(await userManager.FindByEmailAsync(request.Email) != null)
        {
            throw new ConflictException(localizer.Get("Validation.Common.AlreadyExists", "Email"));
        }

        var user = mapper.Map<User>(request);
        var res = await userManager.CreateAsync(user, request.Password);

        if(!res.Succeeded)
        {
            var errors = res.Errors.Select(x => x.Description).ToList();
            throw new BadRequestException(
                localizer.Get("Validation.Common.OperationFailed"), errors);
        }

        res = await userManager.AddToRoleAsync(user, UserRoles.User);

        if(!res.Succeeded)
        {
            await userManager.DeleteAsync(user);

            var errors = res.Errors.Select(x => x.Description).ToList();
            throw new BadRequestException(localizer.Get("Validation.Common.OperationFailed"), errors);
        }

        return ResponseDto.CreatedResponse(localizer.Get("Auth.Registration.Success.CheckEmail"));
    }
}