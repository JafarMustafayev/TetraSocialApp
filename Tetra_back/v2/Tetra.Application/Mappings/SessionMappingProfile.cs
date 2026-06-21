using Tetra.Application.DTOs.Auth.Session;

namespace Tetra.Application.Mappings;

public class SessionMappingProfile : Profile
{
    public SessionMappingProfile()
    {
        CreateMap<AuthSession, UserSessionListItemDto>();
    }
}