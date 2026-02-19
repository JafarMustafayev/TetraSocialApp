namespace Hukaa_back.Services.Auth;

public class AccountManagementService(
    ICurrentUserService currentUserService,
    SignInManager<AppUser> signInManager,
    UserManager<AppUser> userManager):IAccountManagementService
{
    public async Task<ResponseDto> CheckPassword(CheckPasswordRequestDto request)
    {
        var userId = currentUserService.UserId;
        
        var user = await userManager.FindByIdAsync(userId);
        if (user == null)
        {
            throw new NotFoundException("User", userId);
        }
        
         var res = await signInManager.CheckPasswordSignInAsync(user,request.Password,false);

         if (!res.Succeeded)
         {
             return new ResponseDto()
             {
                 Success = res.Succeeded,
                 StatusCode = StatusCodes.Status401Unauthorized,
                 Message = "The password provided is incorrect."
             };
         }

         return new ResponseDto()
         {
             Success = res.Succeeded,
             StatusCode = StatusCodes.Status200OK,
             Message = "The password provided is correct."
         };
    }

    public async Task<ResponseDto> ChangePasswordAsync(ChangePasswordDto request)
    {
        var userId = currentUserService.UserId;
        
        var user = await userManager.FindByIdAsync(userId);

        if (user == null)
        {
            throw new NotFoundException("User", userId);
        }
        
        var res = await userManager.ChangePasswordAsync(user,request.CurrentPassword, request.NewPassword);
        
        if (!res.Succeeded)
        {
            throw new Exceptions.ValidationException("Unexpected error occurred.",
                res.Errors.Select(err => err.Description).ToList());
        }

        return new ResponseDto()
        {
            Success = res.Succeeded,
            Errors = res.Errors.Select(err => err.Description).ToList(),
            StatusCode = StatusCodes.Status200OK
        };
    }

    public async Task<ResponseDto> ChangeUsernameAsync(ChangeUsernameDto request)
    {
        var isExist = await userManager.FindByNameAsync(request.UserName) != null;

        if (isExist)
        {
            throw new BadRequestException("User already exists.",new []{"User already exists."});
        }
        
        var userId = currentUserService.UserId;
        
        var user = await userManager.FindByIdAsync(userId);

        if (user == null)
        {
            throw new NotFoundException("User", userId);
        }
        
        user.UserName = request.UserName; 
        await userManager.UpdateNormalizedUserNameAsync(user);
        var res = await userManager.UpdateAsync(user);
        
        if (!res.Succeeded)
        {
            throw new Exceptions.ValidationException("Unexpected error occurred.",
                res.Errors.Select(err => err.Description).ToList());
        }

        return new ResponseDto()
        {
            Success = res.Succeeded,
            StatusCode = StatusCodes.Status200OK,
            Message = "The username changed successfully."
        };
    }
}
