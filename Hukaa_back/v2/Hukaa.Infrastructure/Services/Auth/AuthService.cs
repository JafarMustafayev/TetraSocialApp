namespace Hukaa.Infrastructure.Services.Auth;

public class AuthService(
    UserManager<User> userManager,
    SignInManager<User> signInManager,
    RoleManager<Role> roleManager,
    IAppConfig appConfig,
    IMapper mapper,
    ILocalizationService localizer,
    ITokenService tokenService,
    ISessionService sessionService
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

    public async Task<AuthTokenResponse> LoginAsync(LoginRequestDto request)
    {
        var user = Regex.IsMatch(request.EmailOrUsername, @"[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+")
            ? await userManager.FindByEmailAsync(request.EmailOrUsername) ?? null
            : await userManager.FindByNameAsync(request.EmailOrUsername) ?? null;

        if(user == null)
        {
            throw new UnauthorizedException(localizer.Get("Auth.Login.Failure.Common"));
        }

        await ValidateUserStatusAsync(user);

        var result = await signInManager.PasswordSignInAsync(user, request.Password, false, false);

        if(!result.Succeeded && !result.RequiresTwoFactor)
        {
            throw new UnauthorizedException(localizer.Get("Auth.Login.Failure.Common"));
        }

        var roles = await userManager.GetRolesAsync(user);
        var sessionId = await sessionService.CreateSessionAsync(user.Id);
        var refreshToken = await tokenService.GenerateRefreshTokenAsync(sessionId);
        var accessToken = tokenService.GenerateAccessToken(user.Id, sessionId, roles);

        return new AuthTokenResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken
        };
    }

    private async Task ValidateUserStatusAsync(User user)
    {
        if(user.Status == UserStatus.Banned)
        {
            throw new UnauthorizedException(localizer.Get("Auth.Login.Failure.UserBanned"));
        }

        if(await userManager.IsLockedOutAsync(user))
        {
            throw new UnauthorizedException(localizer.Get("Auth.Login.Failure.UserLockedOut"));
        }
    }
}