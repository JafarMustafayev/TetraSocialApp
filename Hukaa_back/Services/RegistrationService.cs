namespace Hukaa_back.Services;

public class RegistrationService(
    UserManager<AppUser> userManager,
    RoleManager<IdentityRole> roleManager):IRegistrationService
{
    public async Task<object> RegisterAsync(RegisterRequestDto request)
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
        
        //Email gonder

        return new
        {
            Id = user.Id,
            Username = user.UserName,
            Email = user.Email,
            Role = UserRoles.User,
            encrypted_Id = WebUtility.UrlEncode(user.Id),
            encrypted_Token = WebUtility.UrlEncode(token)
        };
    
    }

    public Task<ResponseDto> ConfirmEmailAsync(ConfirmEmailDto request)
    {
        throw new NotImplementedException();
    }
}
