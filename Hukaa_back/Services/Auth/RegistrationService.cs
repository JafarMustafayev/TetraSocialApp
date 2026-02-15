namespace Hukaa_back.Services.Auth;

public class RegistrationService(
    UserManager<AppUser> userManager,
    RoleManager<IdentityRole> roleManager,
    IEmailSenderService emailSenderService,
    IAppConfig config):IRegistrationService
{
    
    private readonly ApplicationUrlParameters _urlParameters = config.GetSection<ApplicationUrlParameters>();
    
    public async Task<ResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        var user = new AppUser {
            Email = request.Email,
            UserName = request.Username,
            UserStatus = UserStatus.PendingVerification
        };
        
        var result = await userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            throw new ConflictException("Registering user failed",
                result.Errors.Select(error => error.Description).ToList());
        }

        await roleManager.CreateAsync(new IdentityRole(UserRoles.User));
        result = await userManager.AddToRoleAsync(user, UserRoles.User);
        if (!result.Succeeded)
        {
            await userManager.DeleteAsync(user);
            throw new ConflictException("Registering user failed",
                result.Errors.Select(error => error.Description).ToList());
        }
        
        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        
        var url = $"{_urlParameters.FrontEndApplicationUrl}{_urlParameters.EmailConfirmationUrl}?token={WebUtility.UrlEncode(token)}&id={WebUtility.UrlEncode(user.Id)}&email={WebUtility.UrlEncode(request.Email)}";
        
        await emailSenderService.SendEmailConfirmationAsync(request.Email, url);

        return new()
        {
            Success = true,
            Message = "Successfully registered",
            StatusCode = StatusCodes.Status200OK,
            Data = new
            {
                Id = user.Id,
                Username = user.UserName,
                Email = user.Email,
                Role = UserRoles.User,
                encrypted_Id = WebUtility.UrlEncode(user.Id),
                encrypted_Token = WebUtility.UrlEncode(token)
            }
        };
    
    }

    public async Task<ResponseDto> ConfirmEmailAsync(ConfirmEmailDto request)
    {
        var id = WebUtility.UrlDecode(request.Id);
        var token = WebUtility.UrlDecode(request.Token);

        var user = await userManager.FindByIdAsync(id);
        if (user == null)
        {
            throw new NotFoundException("User", id);
        }

        if (user.EmailConfirmed)
        {
            throw new ConflictException("Email already confirmed");
        }
        
        var res = await userManager.ConfirmEmailAsync(user, token);

        if (!res.Succeeded)
        {
            throw new ValidationException("Invalid or expired email confirmation token",
                res.Errors.Select(err => err.Description).ToList());
        }

        user.UserStatus = UserStatus.Active;
        await userManager.UpdateAsync(user);
        
        return new ResponseDto {
            Success = true,
            Message = "Successfully confirmed email",
            StatusCode = StatusCodes.Status200OK
        };
    }
}
