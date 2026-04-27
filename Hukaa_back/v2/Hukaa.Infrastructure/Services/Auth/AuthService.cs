namespace Hukaa.Infrastructure.Services.Auth;

public class AuthService(
    UserManager<User> userManager,
    SignInManager<User> signInManager,
    IAccountVerificationService accountVerificationService,
    IAppConfig config,
    IMapper mapper,
    ILocalizationService localizer,
    IAuthTokenService authTokenService,
    ISessionService sessionService,
    IJwtClaimsReader claimsReader,
    IMailService mailService,
    IClientUrlService clientUrlService
) : IAuthService
{
    private readonly IdentityOptions _identityOptions = config.GetSection<IdentityOptions>();

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

        if(_identityOptions.SignIn.RequireConfirmedEmail)
        {
            var verificationResult = await accountVerificationService.GenerateEmailConfirmationTokenAsync(user);

            var url = clientUrlService.BuildEmailConfirmationUrl(user.Id, verificationResult.PlainToken);
            
            // todo: then it will be sent in a professional form with "queue"
            await mailService.SendConfirmationMail(user.Email, url);
            return ResponseDto.CreatedResponse(
                localizer.Get("Auth.Registration.Success.Pending"),
                new
                {
                    IsVerifiedEmailRequired = true,
                    verificationResult.ExpiresAt
                });
        }

        return ResponseDto.CreatedResponse(
            localizer.Get("Auth.Registration.Success.Success"),
            new
            {
                IsVerifiedEmailRequired = false
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

        if(result is { Succeeded: false, RequiresTwoFactor: false })
        {
            throw new UnauthorizedException(localizer.Get("Auth.Login.Failure.Invalid"));
        }

        var roles = await userManager.GetRolesAsync(user);
        var sessionId = await sessionService.CreateSessionAsync(user.Id);
        var refreshToken = await authTokenService.GenerateRefreshTokenAsync(sessionId);
        var accessToken = authTokenService.GenerateAccessToken(user.Id, sessionId, roles);

        return new AuthTokenResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken
        };
    }

    public async Task<AuthTokenResponse> RefreshTokenAsync(RotateTokenRequestDto request)
    {
        var validToken = await authTokenService.ValidateRefreshTokenAsync(request.RefreshToken);
        var user = await userManager.FindByIdAsync(validToken.AuthSession.UserId);

        if(user != null)
        {
            await ValidateUserStatusAsync(user);
            var roles = await userManager.GetRolesAsync(user);

            return await authTokenService.RotateValidatedRefreshTokenAsync(
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

    //------
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