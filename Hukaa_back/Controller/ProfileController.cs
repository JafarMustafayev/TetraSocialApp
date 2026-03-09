namespace Hukaa_back.Controller;

[ApiController]
[Route("/api/[controller]")]
[Authorize]
public class ProfileController(
    IProfileService profileService) : ControllerBase
{
    [HttpGet("Me")]
    public async Task<IActionResult> GetMyProfileHeader()
    {
        var res = await profileService.GetMyProfileHeaderAsync();
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet("MyProfile")]
    public async Task<IActionResult> GetMyProfile()
    {
        var res = await profileService.GetMyProfileAsync();
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet("settings/profile-information")]
    public async Task<IActionResult> GetProfileInformationSettingsData()
    {
        var res = await profileService.GetProfileInformationSettingsDataAsync();
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet("settings/privacy-information")]
    public async Task<IActionResult> GetPrivacySettingData()
    {
        var res = await profileService.GetPrivacySettingDataAsync();
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetUserProfile(string userId)
    {
        var res = await profileService.GetUserProfileAsync(userId);
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet("suggested-people")]
    public async Task<IActionResult> GetSuggestedPeople()
    {
        var result = await profileService.GetSuggestedPeopleAsync();
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchUserProfile([FromQuery] string query)
    {
        var res = await profileService.SearchUserProfileAsync(query);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPut("profile-information")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileInformationDto profile)
    {
        var res = await profileService.UpdateProfileAsync(profile);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPut("profile-photo")]
    public async Task<IActionResult> ProfilePhoto([FromForm] ChangeProfilePhotoCoverDto dto)
    {
        var res = await profileService.ChangeProfilePhotoAsync(dto);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPut("cover-photo")]
    public async Task<IActionResult> CoverPhoto([FromForm] ChangeProfilePhotoCoverDto dto)
    {
        var res = await profileService.ChangeCoverPhotoAsync(dto);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPut("privacy")]
    public async Task<IActionResult> Privacy()
    {
        var res = await profileService.TogglePrivacyAsync();
        return StatusCode(res.StatusCode, res);
    }
}