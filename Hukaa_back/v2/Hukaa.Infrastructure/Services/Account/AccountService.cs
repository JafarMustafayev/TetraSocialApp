namespace Hukaa.Infrastructure.Services.Account;

public class AccountService(
    UserManager<User> userManager,
    ILocalizationService localizer) : IAccountService
{
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