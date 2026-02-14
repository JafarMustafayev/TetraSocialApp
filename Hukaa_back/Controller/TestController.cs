using Microsoft.AspNetCore.Mvc;

namespace Hukaa_back.Controller;

[ApiController]
[Route("[controller]/[action]")]
public class TestController(IRegistrationService service):ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Register()
    {
        var res = await service.RegisterAsync(new ()
        {
            Email = "test@gmail.com",
            Password = "123456",
            Username =  "test"
        });
        
        return Ok(res);
    }
}
