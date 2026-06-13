namespace Hukaa.Infrastructure.Services.Account;

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
            AccentHue = 200, // daha sonra dinamik olaraq deyisilecek 
            AvatarUrl = "",
            EmailVerified = user.EmailConfirmed,
            IsAdmin = roles.Contains(UserRoles.Admin),
            Name = user.FirstName + " " + user.LastName
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
        var avail = false;
        if(await userManager.FindByEmailAsync(email) == null)
        {
            avail = true;
        }

        return ReturnAvailabilityResponse(avail);
    }

    public async Task<ResponseDto> CheckUsernameAvailabilityAsync(string username)
    {
        CheckNullOrEmpty(username, "Username");
        var avail = false;
        if(await userManager.FindByNameAsync(username) == null)
        {
            avail = true;
        }

        return ReturnAvailabilityResponse(avail);
    }
    public Task<ResponseDto> ChangeEmailAsync(ChangeEmailRequestDto request)
    {
        throw new NotImplementedException();
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
            throw new ValidationException(
                string.Join(", ", result.Errors.Select(x => x.Description))
            );
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
}