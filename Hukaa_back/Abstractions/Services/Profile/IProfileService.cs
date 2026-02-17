namespace Hukaa_back.Abstractions.Services.Profile;

public interface IProfileService
{
    Task<ResponseDto> GetMyProfileHeaderAsync();
    Task<ResponseDto> GetMyProfileAsync();
    Task<ResponseDto> GetUserProfileAsync(string targetUserId);
    Task ChangeProfilePhotoAsync(int userId, IFormFile file);
    Task ChangeCoverPhotoAsync(int userId, IFormFile file);
    Task TogglePrivacyAsync();
}
