using AutoMapper;

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
    public async Task<IActionResult> MyProfile()
    {
        var res = await profileService.GetMyProfileAsync();
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> Get(string userId)
    {
        var res = await profileService.GetUserProfileAsync(userId);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPut("profile-photo")]
    public async Task<IActionResult> ProfilPhoto()
    {
        var res = await profileService.GetMyProfileAsync();
        return StatusCode(res.StatusCode, res);
    }

    [HttpPut("cover-photo")]
    public async Task<IActionResult> CoverPhoto()
    {
        var res = await profileService.GetMyProfileAsync();
        return StatusCode(res.StatusCode, res);
    }

    [HttpPut("privacy")]
    public async Task<IActionResult> Privacy()
    {
        var res = await profileService.GetMyProfileAsync();
        return StatusCode(res.StatusCode, res);
    }   

}