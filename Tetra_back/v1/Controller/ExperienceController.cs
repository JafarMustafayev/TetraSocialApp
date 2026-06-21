namespace Hukaa_back.Controller;

[Route("api/profile/[controller]")]
[ApiController]
[Authorize]
public class ExperienceController(
    IExperienceService experienceService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Experiences()
    {
        var res = await experienceService.GetMyExperiencesAsync();
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> UserExperiences(string userId)
    {
        var res = await experienceService.GetUserExperiencesAsync(userId);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPost]
    public async Task<IActionResult> AddExperiences([FromBody] CreateExperienceDto dto)
    {
        var res = await experienceService.AddExperienceAsync(dto);
        return StatusCode(res.StatusCode, res);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateExperiences(string id, [FromBody] UpdateExperienceDto dto)
    {
        var res = await experienceService.UpdateExperienceAsync(id, dto);
        return StatusCode(res.StatusCode, res);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteExperiences(string id)
    {
        var res = await experienceService.DeleteExperienceAsync(id);
        return StatusCode(res.StatusCode, res);
    }
}