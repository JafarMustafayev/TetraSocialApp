namespace Tetra.Infrastructure.Services.Account;

public class AccountService(
    UserManager<User> userManager,
    IJwtClaimsReader claimsReader,
    ILocalizationService localizer) : IAccountService
{
    public async Task<ResponseDto> GetCurrentUserAsync()
    {
        var userId = claimsReader.GetUserId();
        var user = await userManager.FindByIdAsync(userId);
        if(user == null)
        {
            throw new NotFoundException(localizer.Get("Error.Common.NotFoundWithParameter", "User",
                new Dictionary<string, object>
                {
                    ["Parameter"] = userId
                }
            ));
        }

        var roles = await userManager.GetRolesAsync(user);

        var userData = new CurrentUserDto
        {
            Id = userId,
            Email = user.Email,
            Username = user.UserName,
            AccentHue = 200,
            AvatarUrl = "",
            EmailVerified = user.EmailConfirmed,
            IsAdmin = roles.Contains(UserRoles.Admin),
            Name = "user.FirstName" + " " + "user.LastName"
        };

        return new ResponseDto
        {
            StatusCode = StatusCodes.Status200OK,
            Success = true,
            Message = "User retrieved successfully",
            Data = userData
        };
    }
    public async Task<ResponseDto> CheckEmailAvailabilityAsync(string email)
    {
        CheckNullOrEmpty(email, "Email");
        CheckValidEmail(email);
        var avail = await userManager.FindByEmailAsync(email) == null;

        return ReturnAvailabilityResponse(avail);
    }

    public async Task<ResponseDto> CheckUsernameAvailabilityAsync(string username)
    {
        CheckNullOrEmpty(username, "Username");
        var avail = await userManager.FindByNameAsync(username) == null;

        return ReturnAvailabilityResponse(avail);
    }
    public async Task<ResponseDto<object>> ChangeEmailAsync(ChangeEmailRequestDto request)
    {
        CheckNullOrEmpty(request.Email, "Email");
        CheckValidEmail(request.Email);

        if(await userManager.FindByEmailAsync(request.Email) != null)
        {
            throw new ConflictException(localizer.Get("Validation.Common.Validation.AlreadyExists", "Email"));
        }

        var userId = claimsReader.GetUserId();
        var user = await userManager.FindByIdAsync(userId);
        if(user == null)
        {
            throw new NotFoundException(localizer.Get("Error.Common.NotFoundWithParameter", "User",
                new Dictionary<string, object>
                {
                    ["Parameter"] = userId
                }
            ));
        }

        var checkResult = await userManager.CheckPasswordAsync(user, request.Password);
        if(!checkResult)
        {
            throw new UnauthorizedException(localizer.Get("Auth.Login.Failure.InvalidPassword"));
        }

        var token = await userManager.GenerateChangeEmailTokenAsync(user, request.Email);

        var changeResult = await userManager.ChangeEmailAsync(user, request.Email, token);
        if(!changeResult.Succeeded)
        {
            var errors = changeResult.Errors.Select(x => x.Description).ToList();
            throw new ConflictException(localizer.Get("Validation.Common.Validation.Failure"), errors);
        }

        return ResponseDto<object>.OkResponse(localizer.Get("Auth.Email.Changed.Success"), new
        {
            user.Email
        });
    }
    public async Task<ResponseDto<object>> ChangeUsernameAsync(ChangeUsernameRequestDto request)
    {
        CheckNullOrEmpty(request.Username, "Username");

        if(await userManager.FindByNameAsync(request.Username) != null)
        {
            throw new ConflictException(localizer.Get("Validation.Common.Validation.AlreadyExists", "Username"));
        }

        var userId = claimsReader.GetUserId();

        var user = await userManager.FindByIdAsync(userId);
        if(user == null)
        {
            throw new NotFoundException(localizer.Get("Error.Common.NotFoundWithParameter", "User",
                new Dictionary<string, object>
                {
                    ["Parameter"] = userId
                }
            ));
        }

        var result = await userManager.SetUserNameAsync(user, request.Username);

        if(!result.Succeeded)
        {
            var errors = result.Errors.Select(x => x.Description).ToList();
            throw new ConflictException(localizer.Get("Validation.Common.Validation.Failure"), errors);
        }

        return ResponseDto<object>.OkResponse(localizer.Get("Auth.Username.Changed.Success"), new
        {
            Username = user.UserName
        });
    }

    private ResponseDto ReturnAvailabilityResponse(bool avail)
    {
        return new ResponseDto
        {
            Success = true,
            StatusCode = StatusCodes.Status200OK,
            Message = "Checked successfully",
            Data = new
            {
                isAvailable = avail
            }
        };
    }

    private void CheckNullOrEmpty(string value, string? paramName = null)
    {
        if(string.IsNullOrEmpty(value) || string.IsNullOrWhiteSpace(value))
        {
            throw new ConflictException(localizer.Get("Validation.Common.Validation.Required", paramName ?? "Query"));
        }
    }

    private void CheckValidEmail(string email)
    {
        if(!Regex.IsMatch(email, @"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"))
        {
            throw new ConflictException(localizer.Get("Validation.Common.Validation.InvalidEmail"));
        }
    }
}