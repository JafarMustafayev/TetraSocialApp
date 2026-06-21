namespace Hukaa_back.Abstractions.Services.Profile;

public interface IProfileService
{
    Task<ResponseDto> GetMyProfileHeaderAsync();
    Task<ResponseDto> GetMyProfileAsync();
    Task<ResponseDto> GetProfileInformationSettingsDataAsync();
    Task<ResponseDto> GetPrivacySettingDataAsync();
    Task<ResponseDto> GetUserProfileAsync(string targetUserId);
    Task<ResponseDto> GetSuggestedPeopleAsync();
    Task<ResponseDto> GetTodayBirthdaysAsync();
    Task<ResponseDto> SearchUserProfileAsync(string query);
    Task<ResponseDto> UpdateProfileAsync(UpdateProfileInformationDto dto);
    Task<ResponseDto> ChangeProfilePhotoAsync(ChangeProfilePhotoCoverDto dto);
    Task<ResponseDto> ChangeCoverPhotoAsync(ChangeProfilePhotoCoverDto dto);
    Task<ResponseDto> TogglePrivacyAsync();
}