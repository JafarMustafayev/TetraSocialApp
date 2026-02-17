namespace Hukaa_back.Services.Profile;

public class ExperienceService(
    ICurrentUserService currentUser,
    IMapper mapper,
    AppDbContext _context) : IExperienceService
{
    public async Task<ResponseDto> GetMyExperiencesAsync()
    {
        var userId = currentUser.UserId;

        var experiences = await _context.WorkExperiences
            .Where(x => x.AppUserId == userId && !x.IsDeleted)
            .OrderByDescending(x => x.StartAt)
            .ToListAsync();

        var map = mapper.Map<List<ExperienceDataDto>>(experiences);

        return new()
        {
            Success = true,
            StatusCode = StatusCodes.Status200OK,
            Data = map,
            Message = "Experience data has been successfully retrieved."
        };
    }

    public async Task<ResponseDto> GetUserExperiencesAsync(string userId)
    {
        var experiences = await _context.WorkExperiences
                    .Where(x => x.AppUserId == userId && !x.IsDeleted)
                    .OrderByDescending(x => x.StartAt)
                    .ToListAsync();

        var map = mapper.Map<List<ExperienceDataDto>>(experiences);

        return new()
        {
            Success = true,
            StatusCode = StatusCodes.Status200OK,
            Data = map,
            Message = "Experience data has been successfully retrieved."
        };
    }

    public async Task<ResponseDto> AddExperienceAsync(CreateExperienceDto dto)
    {
        var experience = mapper.Map<WorkExperience>(dto);

        experience.AppUserId = currentUser.UserId;

        await _context.WorkExperiences.AddAsync(experience);
        await _context.SaveChangesAsync();

        var map = mapper.Map<ExperienceDataDto>(experience);

        return new()
        {
            Success = true,
            StatusCode = StatusCodes.Status201Created,
            Message = "Successfully created",
            Data = map
        };
    }

    public async Task<ResponseDto> UpdateExperienceAsync(string expId, UpdateExperienceDto dto)
    {
        var userId = currentUser.UserId;

        var experience = await _context.WorkExperiences
           .FirstOrDefaultAsync(x => x.Id == expId && x.AppUserId == userId && !x.IsDeleted);

        if (experience == null)
            throw new NotFoundException("Experience",expId);

        mapper.Map(dto, experience);

        await _context.SaveChangesAsync();

        return new()
        {
            Success = true,
            StatusCode = StatusCodes.Status204NoContent,
            Message = "Successfully updated",
        };
    }

    public async Task<ResponseDto> DeleteExperienceAsync(string expId)
    {
        var userId = currentUser.UserId;

        var experience = await _context.WorkExperiences
           .FirstOrDefaultAsync(x => x.Id == expId && x.AppUserId == userId && !x.IsDeleted);

        if (experience == null)
            throw new NotFoundException("Experience", expId);

        experience.IsDeleted = true;
        experience.DeleteAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new()
        {
            Success = true,
            StatusCode = StatusCodes.Status204NoContent,
            Message = "Successfully deleted",
        };
    }
}
