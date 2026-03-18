namespace Hukaa_back.Mappings;

public class AuthMapping : Profile
{
    public AuthMapping()
    {
        CreateMap<RegisterRequestDto, AppUser>()
            .ForMember(des => des.Gender, opt => opt.MapFrom(src => Gender.None))
            .ForMember(des => des.AccountType, opt => opt.MapFrom(src => AccountType.PrivateAccount))
            .ForMember(des => des.RelationshipStatus, opt => opt.MapFrom(src => RelationshipStatus.None))
            .ForMember(des => des.UserStatus, opt => opt.MapFrom(src => UserStatus.PendingVerification))
            .ForMember(des => des.CoverPhotoPath, opt => opt.MapFrom(src => "profile/cover/default-my-profile-bg.jpg"))
            .ForMember(des => des.ProfilePhotoPath, opt => opt.MapFrom(src => "profile/photo/default-my-profile.png"));
    }
}