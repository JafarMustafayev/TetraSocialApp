namespace Hukaa_back.Services.Profile;

public class ProfileService(
    ICurrentUserService currentUser,
    AppDbContext dbContext,
    IMapper mapper,
    IFileService fileService) : IProfileService
{

    public async Task<ResponseDto> GetMyProfileHeaderAsync()
    {
        var userId = currentUser.UserId;

        var myProfile = await dbContext.Users
            .FirstOrDefaultAsync(x => x.Id == userId);

        if (myProfile == null)
        {
            throw new NotFoundException("User", userId);
        }

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
            .Include(x=>x.WorkExperiences.Where(x=>!x.IsDeleted))
            .Include(x=>x.Posts.Where(x=>!x.IsArchived && !x.IsDeleted))
            .FirstOrDefaultAsync(x=>x.Id == userId); 

        if(myProfile == null)
        {
            throw new NotFoundException("User", userId);
        }

        var profileDetail = mapper.Map<MyProfileDto>(myProfile);

        profileDetail.MyPosts = mapper.Map<List<SinglePostDto>>(myProfile.Posts);
        profileDetail.Experiences = mapper.Map<List<ExperienceDataDto>>(myProfile.WorkExperiences);
        
        return new()
        {
            StatusCode = 200,
            Message = "Your profile data has been successfully retrieved.",
            Success = true,
            Data = profileDetail
        };
    }

    public async Task<ResponseDto> GetSettingsData()
    {
        var userId = currentUser.UserId;

        var myProfile = await dbContext.Users
            .FirstOrDefaultAsync(x => x.Id == userId);

        if (myProfile == null)
        {
            throw new NotFoundException("User", userId);
        }

        return new()
        {
            StatusCode = 200,
            Message = "Your profile settings data has been successfully retrieved.",
            Success = true,
            Data = new
            {   
                FirstName = myProfile.FirstName,
                LastName = myProfile.LastName,
                Bio = myProfile.Bio,
                BirthDay = myProfile.BirthDay,
                PhoneNumber = myProfile.PhoneNumber,
                Gender = myProfile.Gender,
                RelationshipStatus = myProfile.RelationshipStatus
            }
        };
    }

    public async Task<ResponseDto> UpdateProfileAsync(UpdateProfileInformationDto dto)
    {
        var userId = currentUser.UserId;

        var myProfile = await dbContext.Users
            .FirstOrDefaultAsync(x => x.Id == userId);

        if (myProfile == null)
        {
            throw new NotFoundException("User", userId);
        }

        mapper.Map(dto, myProfile);

        await dbContext.SaveChangesAsync();

        return new()
        {
            Success = true,
            StatusCode = StatusCodes.Status200OK,

            Data = dto
        };
    }

    public async Task<ResponseDto> ChangeCoverPhotoAsync(ChangeProfilPhotoCoverDto dto)
    {

        var userId = currentUser.UserId;

        var user = await dbContext.Users
            .FirstOrDefaultAsync(x => x.Id == userId);

        if (user == null) {
            throw new NotFoundException("User", userId);
        }

        var filePath = await fileService.UploadCoverImageAsync(dto.File);

        user.CoverPhotoPath = filePath;

        await dbContext.SaveChangesAsync();

        return new()
        {
            StatusCode = 200,
            Success = true,
            Message = "",
            Data = new
            {
                FilePath = filePath,
            }
        };
    }

    public async Task<ResponseDto> ChangeProfilePhotoAsync(ChangeProfilPhotoCoverDto dto) 
    {
        var userId = currentUser.UserId;

        var user = await dbContext.Users
            .FirstOrDefaultAsync(x => x.Id == userId);

        if (user == null)
        {
            throw new NotFoundException("User", userId);
        }

        var filePath = await fileService.UploadProfilImageAsync(dto.File);

        user.ProfilePhotoPath = filePath;

        await dbContext.SaveChangesAsync();

        return new()
        {
            StatusCode = 200,
            Success = true,
            Message = "",
            Data = new
            {
                FilePath = filePath,
            }
        };
    }

    public async Task<ResponseDto> GetUserProfileAsync(string targetUserId)
    {
        var myProfile = await dbContext.Users
             .Include(x => x.WorkExperiences)
             .Include(x => x.Posts.Where(x => !x.IsArchived && !x.IsDeleted))
             .FirstOrDefaultAsync(x => x.Id == targetUserId); 

        var profileDetail = mapper.Map<MyProfileDto>(myProfile);

        return new()
        {
            StatusCode = 200,
            Message = "Profile data has been successfully retrieved.",
            Success = true,
            Data = profileDetail
        };
    }

    public Task<ResponseDto> TogglePrivacyAsync()
    {
        var userId = currentUser.UserId;
        throw new NotImplementedException();
    }

    
}
