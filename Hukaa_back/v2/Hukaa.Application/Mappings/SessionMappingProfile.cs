namespace Hukaa.Application.Mappings;

public class SessionMappingProfile : Profile
{
    public SessionMappingProfile()
    {
        CreateMap<AuthSession, UserSessionListItemDto>();
    }
}