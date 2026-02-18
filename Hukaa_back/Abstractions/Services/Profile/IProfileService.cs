namespace Hukaa_back.Abstractions.Services.Profile;

public interface IProfileService
{
    Task<ResponseDto> GetMyProfileHeaderAsync();
    Task<ResponseDto> GetMyProfileAsync();
    Task<ResponseDto> GetSettingsData();
    Task<ResponseDto> GetUserProfileAsync(string targetUserId);
    Task<ResponseDto> UpdateProfileAsync(UpdateProfileInformationDto dto);
    Task<ResponseDto> ChangeProfilePhotoAsync(ChangeProfilPhotoCoverDto dto);
    Task<ResponseDto> ChangeCoverPhotoAsync(ChangeProfilPhotoCoverDto dto);
    Task<ResponseDto> TogglePrivacyAsync();
}
