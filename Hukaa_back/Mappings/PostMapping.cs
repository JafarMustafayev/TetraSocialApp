namespace Hukaa_back.Mappings;

public class PostMapping:Profile
{
    public PostMapping()
    {
        CreateMap<Post,SinglePostDto>();
    }
}
