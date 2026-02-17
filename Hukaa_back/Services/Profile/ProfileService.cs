namespace Hukaa_back.Services.Profile;

public class ProfileService(
    ICurrentUserService currentUser,
    AppDbContext dbContext,
    IMapper mapper) : IProfileService
{

    public async Task<ResponseDto> GetMyProfileHeaderAsync()
    {
        var userId = currentUser.UserId;

        var myProfile = await dbContext.Users
            .FirstOrDefaultAsync(x => x.Id == userId);

        return new()
        {
            StatusCode = 200,
            Message = "Your profile data has been successfully retrieved.",
            Success = true,
            Data = new
            {
                Username = myProfile.UserName,
                Email = myProfile.Email,
                FirstName = myProfile.FirstName,
                LastName = myProfile.LastName,
                ProfilePhoto = myProfile.ProfilePhotoPath
            }
        };
    }

    public async Task<ResponseDto> GetMyProfileAsync()
    {
        var userId = currentUser.UserId;

        var myProfile = await dbContext.Users
            .Include(x=>x.WorkExperiences)
            .Include(x=>x.Posts.Where(x=>!x.IsArchived && !x.IsDeleted))
            .FirstOrDefaultAsync(x=>x.Id == userId); // heleki bele user ID token daxilinden alinacaq 
        
        var profileDetail = mapper.Map<MyProfileDto>(myProfile);

        profileDetail.AbouteMe = mapper.Map<AbouteMeDto>(myProfile);
        
        return new()
        {
            StatusCode = 200,
            Message = "Your profile data has been successfully retrieved.",
            Success = true,
            Data = profileDetail
        };
    }

    public Task ChangeCoverPhotoAsync(int userId, IFormFile file)
    {
        throw new NotImplementedException();
    }

    public Task ChangeProfilePhotoAsync(int userId, IFormFile file)
    {
        throw new NotImplementedException();
    }

    public async Task<ResponseDto> GetUserProfileAsync(string targetUserId)
    {
        var myProfile = await dbContext.Users
             .Include(x => x.WorkExperiences)
             .Include(x => x.Posts.Where(x => !x.IsArchived && !x.IsDeleted))
             .FirstOrDefaultAsync(x => x.Id == targetUserId); 

        var profileDetail = mapper.Map<MyProfileDto>(myProfile);

        profileDetail.AbouteMe = mapper.Map<AbouteMeDto>(myProfile);

        return new()
        {
            StatusCode = 200,
            Message = "Profile data has been successfully retrieved.",
            Success = true,
            Data = profileDetail
        };
    }

    public Task TogglePrivacyAsync()
    {
        throw new NotImplementedException();
    }

    
}
