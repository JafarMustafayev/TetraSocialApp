namespace Hukaa_back.Controller;

[ApiController]
[Route("/api/[controller]")]
public class ProfileController(
    IProfileService profileService):ControllerBase
{
    [HttpGet("Me")]
    public async Task<IActionResult> GetMyProfileHeader()
    {
        var res = await profileService.GetMyProfileHeaderAsync();
        return StatusCode(res.StatusCode,res);
    }

    [HttpGet("MyProfile")]
    public async Task<IActionResult> GetMyProfile()
    {
        var res = await profileService.GetMyProfileAsync();
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet("settings/profil-information")]
    public async Task<IActionResult> GetSettingsData()
    {
        var res = await profileService.GetSettingsData();
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetUserProfile(string userId)
    {
        var res = await profileService.GetUserProfileAsync(userId);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPut("profil-information")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileInformationDto profile)
    {
        var res = await profileService.UpdateProfileAsync(profile);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPut("profile-photo")]
    public async Task<IActionResult> ProfilPhoto([FromForm] ChangeProfilPhotoCoverDto dto)
    {
        var res = await profileService.ChangeProfilePhotoAsync(dto);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPut("cover-photo")]
    public async Task<IActionResult> CoverPhoto([FromForm] ChangeProfilPhotoCoverDto dto)
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