namespace Hukaa_back.Abstractions.Services.Profile;

public interface IExperienceService
{
    Task<ResponseDto> GetMyExperiencesAsync();

    Task<ResponseDto> GetUserExperiencesAsync(string userId);

    Task<ResponseDto> AddExperienceAsync(CreateExperienceDto dto);

    Task<ResponseDto> UpdateExperienceAsync( string expId, UpdateExperienceDto dto);

    Task<ResponseDto> DeleteExperienceAsync(string expId);
}

