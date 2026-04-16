namespace Hukaa.Infrastructure.Services.Auth;

public class AuthService(
    UserManager<User> userManager,
    SignInManager<User> signInManager,
    RoleManager<Role> roleManager,
    IAppConfig config,
    IMapper mapper,
    ILocalizationService localizer,
    ITokenService tokenService,
    ISessionService sessionService,
    IJwtClaimsReader claimsReader
) : IAuthService
{
    private readonly IdentityConfigOptions _identityConfigOptions = config.GetSection<IdentityConfigOptions>();

    public async Task<ResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        if(await userManager.FindByNameAsync(request.Username) != null)
        {
            throw new ConflictException(localizer.Get("Validation.Common.Validation.AlreadyExists", "Username"));
        }

        if(await userManager.FindByEmailAsync(request.Email) != null)
        {
            throw new ConflictException(localizer.Get("Validation.Common.Validation.AlreadyExists", "Email"));
        }

        var user = mapper.Map<User>(request);
        var res = await userManager.CreateAsync(user, request.Password);

        if(!res.Succeeded)
        {
            var errors = res.Errors.Select(x => x.Description).ToList();
            throw new BadRequestException(
                localizer.Get("Validation.Common.Validation.Failure"), errors);
        }

        res = await userManager.AddToRoleAsync(user, UserRoles.User);

        if(!res.Succeeded)
        {
            await userManager.DeleteAsync(user);

            var errors = res.Errors.Select(x => x.Description).ToList();
            throw new BadRequestException(localizer.Get("Validation.Common.Validation.Failure"), errors);
        }

        return ResponseDto.CreatedResponse(_identityConfigOptions.SignIn.RequireConfirmedEmail
                ? localizer.Get("Auth.Registration.Success.Pending")
                : localizer.Get("Auth.Registration.Success.Success"),
            new
            {
                IsVerifiedEmailRequired = _identityConfigOptions.SignIn.RequireConfirmedEmail
            });
    }

    public async Task<AuthTokenResponse> LoginAsync(LoginRequestDto request)
    {
        var user = Regex.IsMatch(request.EmailOrUsername, @"[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+")
            ? await userManager.FindByEmailAsync(request.EmailOrUsername) ?? null
            : await userManager.FindByNameAsync(request.EmailOrUsername) ?? null;

        if(user == null)
        {
            throw new UnauthorizedException(localizer.Get("Auth.Login.Failure.Invalid"));
        }

        await ValidateUserStatusAsync(user);

        var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, true);

        if(!result.Succeeded && !result.RequiresTwoFactor)
        {
            throw new UnauthorizedException(localizer.Get("Auth.Login.Failure.Invalid"));
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

    public async Task<AuthTokenResponse> RefreshTokenAsync(RotateTokenRequestDto request)
    {
        var validToken = await tokenService.ValidateRefreshTokenAsync(request.RefreshToken);
        var user = await userManager.FindByIdAsync(validToken.AuthSession.UserId);

        if(user != null)
        {
            var roles = await userManager.GetRolesAsync(user);

            return await tokenService.RotateRefreshTokenAsync(
                request.RefreshToken,
                user.Id,
                roles.ToList()
            );
        }

        throw new UnauthorizedException(localizer.Get("Validation.Common.Validation.Failure"));
    }

    public async Task<ResponseDto> LogoutAsync()
    {
        var sessionId = claimsReader.GetSessionId();

        await sessionService.RevokeSessionAsync(sessionId);
        return ResponseDto.OkResponse(localizer.Get("Auth.Logout.Success"));
    }

    private async Task ValidateUserStatusAsync(User user)
    {
        if(user.Status == UserStatus.Banned)
        {
            throw new UnauthorizedException(localizer.Get("Auth.Login.Failure.Banned"));
        }

        if(await userManager.IsLockedOutAsync(user))
        {
            throw new UnauthorizedException(localizer.Get("Auth.Login.Failure.Locked"));
        }
    }
}