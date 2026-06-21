namespace Tetra.Application.Mappings;

public class AuthMappingProfile : Profile
{
    public AuthMappingProfile()
    {
        CreateMap<RegisterRequestDto, User>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => UserStatus.PendingVerification))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));
    }
}