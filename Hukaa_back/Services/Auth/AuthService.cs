namespace Hukaa_back.Services.Auth;

public class AuthService(
    UserManager<AppUser> userManager,
    ITokenService tokenService,
    SignInManager<AppUser> signInManager) : IAuthService
{
    public async Task<ResponseDto> LoginAsync(LoginRequestDto request)
    {
        var identifier = request.UsernameOrEmail.Trim();

        var user = Regex.IsMatch(identifier, @"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$")
            ? await userManager.FindByEmailAsync(identifier)
            : await userManager.FindByNameAsync(identifier);
        if (user == null)
        {
            throw new UnauthorizedException(errors: ["Username(Email) or  password is incorrect "]);
        }

        var signInResult = await signInManager.CheckPasswordSignInAsync(user, request.Password, true);
        if (!signInResult.Succeeded)
        {
            HandleFailedSignIn(signInResult);
        }
        else if (user.UserStatus == UserStatus.Banned)
        {
            throw new UnauthorizedException(errors: ["Account is banned to sign in"]);
        }

        var accessToken = tokenService.GenerateAccessToken(user.Id);

        return new ResponseDto
        {
            Success = true,
            Message = "Successfully logged in",
            StatusCode = StatusCodes.Status200OK,
            Data = new
            {
                access_token = accessToken
            }
        };
    }

    private static void HandleFailedSignIn(SignInResult result)
    {
        if (result.IsLockedOut)
        {
            throw new UnauthorizedException(errors: ["Account is temporarily locked"]);
        }

        if (result.IsNotAllowed)
        {
            throw new UnauthorizedException(errors: ["Account is not allowed to sign in"]);
        }

        if (result.RequiresTwoFactor)
        {
            throw new UnauthorizedException(errors: ["Two-factor authentication is required"]);
        }

        throw new UnauthorizedException(errors: ["Username(Email) or password is incorrect"]);
    }
}