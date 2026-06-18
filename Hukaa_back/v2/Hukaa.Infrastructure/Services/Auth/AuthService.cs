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
    IClientUrlService clientUrlService,
    ITwoFactorService twoFactorService
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

        if(!_identityOptions.SignIn.RequireConfirmedEmail)
        {
            return ResponseDto.CreatedResponse(
                localizer.Get("Auth.Registration.Success.Success"),
                new
                {
                    IsVerifiedEmailRequired = false
                });
        }

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

    public async Task<ResponseDto<LoginResponseDto>> LoginAsync(LoginRequestDto request)
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

        if(user.TwoFactorEnabled)
        {
            var twoFactorResult = await twoFactorService.CreateLoginChallengeAsync(user.Id, user.TwoFactorProvider.ToString());
            return ResponseDto<LoginResponseDto>.OkResponse(
                localizer.Get("Auth.Login.Success.RequiresTwoFactor"),
                new LoginResponseDto
                {
                    RequiresTwoFactor = user.TwoFactorEnabled,
                    TwoFactorChallenge = twoFactorResult
                });
        }

        var tokens = await GenerateAuthTokensAsync(user);

        return ResponseDto<LoginResponseDto>.OkResponse(
            localizer.Get("Auth.Login.Success"),
            new LoginResponseDto
            {
                RequiresTwoFactor = user.TwoFactorEnabled,
                Tokens = tokens
            });
    }

    public async Task<ResponseDto<AuthTokenResponse>> RefreshTokenAsync(RotateTokenRequestDto request)
    {
        var validToken = await authTokenService.ValidateRefreshTokenAsync(request.RefreshToken);
        var user = await userManager.FindByIdAsync(validToken.AuthSession.UserId);

        if(user == null)
        {
            throw new UnauthorizedException(localizer.Get("Validation.Common.Validation.Failure"));
        }

        await ValidateUserStatusAsync(user);
        var roles = await userManager.GetRolesAsync(user);

        var res = await authTokenService.RotateValidatedRefreshTokenAsync(
            request.RefreshToken,
            user.Id,
            roles.ToList()
        );

        return ResponseDto<AuthTokenResponse>.OkResponse(
            localizer.Get("Auth.Login.Success"), res);
    }

    public async Task<ResponseDto> LogoutAsync()
    {
        var sessionId = claimsReader.GetSessionId();
        await sessionService.RevokeSessionAsync(sessionId, true);
        return ResponseDto.OkResponse(localizer.Get("Auth.Logout.Success"));
    }
    public async Task<ResponseDto<AuthTokenResponse>> LoginWithTwoFactorAsync(VerifyTwoFactorLoginRequestDto request)
    {
        var response = await twoFactorService.VerifyLoginChallengeAsync(request);
        if(response is { isValid: false, user: null })
        {
            throw new UnauthorizedException(localizer.Get("Auth.Login.Failure.Invalid"));
        }

        var tokens = await GenerateAuthTokensAsync(response.user);
        return ResponseDto<AuthTokenResponse>.OkResponse(
            localizer.Get("Auth.Login.Success"), tokens);
    }
    public async Task<ResponseDto<AuthTokenResponse>> LoginWithRecoveryCodeAsync(RecoveryCodeLoginRequestDto request)
    {
        var response = await twoFactorService.VerifyRecoveryCodeAsync(request);
        if(response is { isValid: false, user: null })
        {
            throw new UnauthorizedException(localizer.Get("Auth.Login.Failure.Invalid"));
        }

        var tokens = await GenerateAuthTokensAsync(response.user);
        return ResponseDto<AuthTokenResponse>.OkResponse(
            localizer.Get("Auth.Login.Success"), tokens);
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

    private async Task<AuthTokenResponse> GenerateAuthTokensAsync(User user)
    {
        var roles = await userManager.GetRolesAsync(user);

        var sessionId = await sessionService.CreateSessionAsync(user.Id);

        var refreshToken = await authTokenService.GenerateRefreshTokenAsync(sessionId);

        var accessToken = authTokenService.GenerateAccessToken(
            user.Id,
            sessionId,
            roles);

        return new AuthTokenResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken
        };
    }
}