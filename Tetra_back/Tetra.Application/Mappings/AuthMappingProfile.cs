namespace Tetra.Application.Mappings;

public class AuthMappingProfile : Profile
{
    public AuthMappingProfile()
    {
        CreateMap<RegisterRequestDto, User>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => UserStatus.PendingVerification))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.Preferences, opt => opt.MapFrom(src => new UserPreferences()))
            .ForMember(dest => dest.Profile, opt => opt.MapFrom(src => new UserProfile
            {
                Birthday = src.DateOfBirth,
                FirstName = src.FirstName,
                LastName = src.LastName
            }));
    }
}