namespace Hukaa_back.Services.Profile;

public class ProfileService(
    ICurrentUserService currentUser,
    AppDbContext dbContext,
    IMapper mapper,
    IFileService fileService,
    UserManager<AppUser> userManager) : IProfileService
{
    // get profile information 
    public async Task<ResponseDto> GetMyProfileHeaderAsync()
    {
        var userId = currentUser.UserId;
        var user = await dbContext.Users
            .FirstOrDefaultAsync(user => user.Id == userId);

        if (user == null)
        {
            throw new NotFoundException("User", userId);
        }
       var isAdmin = await userManager.IsInRoleAsync(user, "Admin");

        return new ResponseDto
        {
            StatusCode = 200,
            Message = "Your profile data has been successfully retrieved.",
            Success = true,
            Data = new
            {
                Id = user.Id,
                Email = user.Email,
                Username = user.UserName,
                LastName = user.LastName,
                FirstName = user.FirstName,
                ProfilePhoto = user.ProfilePhotoPath,
                IsAdmin  = isAdmin
            }
        };
    }

    public async Task<ResponseDto> GetMyProfileAsync()
    {
        var userId = currentUser.UserId;

        var user = await dbContext.Users
            .Include(user => user.WorkExperiences.Where(experience => !experience.IsDeleted))
            .Include(user => user.Posts.Where(post => !post.IsArchived))
            .Include(user => user.Followers.Where(follow => follow.Status == FollowStatus.Accepted))
            .Include(user => user.Following.Where(follow => follow.Status == FollowStatus.Accepted))
            .FirstOrDefaultAsync(user => user.Id == userId);

        if(user == null)
        {
            throw new NotFoundException("User", userId);
        }

        var profileDetail = mapper.Map<ProfileDetailsDto>(user);
        profileDetail.Experiences = mapper.Map<List<ExperienceDataDto>>(user.WorkExperiences);

        return new ResponseDto
        {
            StatusCode = 200,
            Message = "Your profile data has been successfully retrieved.",
            Success = true,
            Data = profileDetail
        };
    }

    public async Task<ResponseDto> GetProfileInformationSettingsDataAsync()
    {
        var userId = currentUser.UserId;

        var user = await dbContext.Users
            .FirstOrDefaultAsync(x => x.Id == userId);

        if(user == null)
        {
            throw new NotFoundException("User", userId);
        }

        return new ResponseDto
        {
            StatusCode = 200,
            Message = "Your profile settings data has been successfully retrieved.",
            Success = true,
            Data = new
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Bio = user.Bio,
                BirthDay = user.BirthDay,
                PhoneNumber = user.PhoneNumber,
                Gender = user.Gender,
                RelationshipStatus = user.RelationshipStatus
            }
        };
    }

    public async Task<ResponseDto> GetPrivacySettingDataAsync()
    {
        var userId = currentUser.UserId;

        var user = await dbContext.Users
            .FirstOrDefaultAsync(x => x.Id == userId);

        if(user == null)
        {
            throw new NotFoundException("User", userId);
        }

        return new ResponseDto
        {
            StatusCode = 200,
            Message = "Your profile settings data has been successfully retrieved.",
            Success = true,
            Data = new
            {
                AccountType = user.AccountType
            }
        };
    }

    public async Task<ResponseDto> GetUserProfileAsync(string targetUserId)
    {
        var user = await dbContext.Users
            .Include(user => user.Followers)
            .Include(user => user.Following)
            .Include(user => user.WorkExperiences)
            .Include(user => user.Posts.Where(post => !post.IsArchived && !post.IsDeleted))
            .FirstOrDefaultAsync(user => user.Id == targetUserId);

        if(user == null)
        {
            throw new NotFoundException("User", targetUserId);
        }

        ProfileSummaryDto profileSummaryDetail;
        var followStatus = user.Followers
            .FirstOrDefault(follow => follow.FollowerId == currentUser.UserId)?.Status ?? FollowStatus.None;

        if(user.AccountType == AccountType.PublicAccount || followStatus == FollowStatus.Accepted)
        {
            profileSummaryDetail = mapper.Map<ProfileDetailsDto>(user);
        }
        else
        {
            profileSummaryDetail = mapper.Map<ProfileSummaryDto>(user);
        }

        profileSummaryDetail.FollowStatus = followStatus;
        profileSummaryDetail.FollowersCount = user.Followers.Count(follow => follow.Status == FollowStatus.Accepted);
        profileSummaryDetail.FollowingCount = user.Following.Count(follow => follow.Status == FollowStatus.Accepted);

        return new ResponseDto
        {
            StatusCode = 200,
            Message = "Profile data has been successfully retrieved.",
            Success = true,
            Data = profileSummaryDetail
        };
    }

    public async Task<ResponseDto> SearchUserProfileAsync(string query)
    {
        if(string.IsNullOrWhiteSpace(query))
        {
            return new ResponseDto
            {
                StatusCode = 400,
                Message = "Search query cannot be empty.",
                Success = false
            };
        }

        query = query.Trim();
        var usersList = await dbContext.Users
            .AsNoTracking()
            .Where(user =>
                (user.FirstName != null && user.FirstName.Contains(query))
                || (user.LastName != null && user.LastName.Contains(query))
                || user.UserName.Contains(query))
            .OrderBy(user => user.UserName)
            .ToListAsync();

        var profileDetail = mapper.Map<List<UserPreviewDto>>(usersList);

        return new ResponseDto
        {
            StatusCode = 200,
            Message = "Profile data has been successfully retrieved.",
            Success = true,
            Data = profileDetail
        };
    }

    // manage profile information 
    public async Task<ResponseDto> UpdateProfileAsync(UpdateProfileInformationDto dto)
    {
        var userId = currentUser.UserId;

        var user = await dbContext.Users
            .FirstOrDefaultAsync(x => x.Id == userId);

        if(user == null)
        {
            throw new NotFoundException("User", userId);
        }

        mapper.Map(dto, user);
        await dbContext.SaveChangesAsync();

        return new ResponseDto
        {
            Success = true,
            StatusCode = StatusCodes.Status200OK,

            Data = dto
        };
    }

    public async Task<ResponseDto> ChangeCoverPhotoAsync(ChangeProfilePhotoCoverDto dto)
    {
        var userId = currentUser.UserId;

        var user = await dbContext.Users
            .FirstOrDefaultAsync(x => x.Id == userId);

        if(user == null)
        {
            throw new NotFoundException("User", userId);
        }

        if(user?.CoverPhotoPath != null
           && user.CoverPhotoPath != "profile/cover/default-my-profile-bg.jpg"
           && fileService.IsExist(user.CoverPhotoPath))
        {
            await fileService.DeleteFileAsync(user.CoverPhotoPath);
        }

        var filePath = await fileService.UploadCoverImageAsync(dto.File);
        user.CoverPhotoPath = filePath;
        await dbContext.SaveChangesAsync();

        return new ResponseDto
        {
            StatusCode = 200,
            Success = true,
            Message = "Updated your profile cover picture",
            Data = new
            {
                FilePath = filePath
            }
        };
    }

    public async Task<ResponseDto> ChangeProfilePhotoAsync(ChangeProfilePhotoCoverDto dto)
    {
        var userId = currentUser.UserId;

        var user = await dbContext.Users
            .FirstOrDefaultAsync(x => x.Id == userId);

        if(user == null)
        {
            throw new NotFoundException("User", userId);
        }

        if(user.ProfilePhotoPath != null
           && user.ProfilePhotoPath != "profile/photo/default-my-profile.png"
           && fileService.IsExist(user.ProfilePhotoPath)
          )
        {
            await fileService.DeleteFileAsync(user.ProfilePhotoPath);
        }

        var filePath = await fileService.UploadProfilImageAsync(dto.File);
        user.ProfilePhotoPath = filePath;
        await dbContext.SaveChangesAsync();

        return new ResponseDto
        {
            StatusCode = 200,
            Success = true,
            Message = "",
            Data = new
            {
                FilePath = filePath
            }
        };
    }

    public async Task<ResponseDto> TogglePrivacyAsync()
    {
        var userId = currentUser.UserId;
        var user = await dbContext.Users
            .FirstOrDefaultAsync(user => user.Id == userId);

        if(user == null)
        {
            throw new NotFoundException("User", userId);
        }

        user.AccountType = user.AccountType == AccountType.PrivateAccount
            ? AccountType.PublicAccount
            : AccountType.PrivateAccount;

        await dbContext.SaveChangesAsync();

        return new ResponseDto
        {
            StatusCode = 200,
            Success = true,
            Message = "Privacy setting updated successfully."
        };
    }
}