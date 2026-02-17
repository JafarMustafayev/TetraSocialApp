namespace Hukaa_back.Mappings;

public class ProfileMapping:Profile
{
    public ProfileMapping()
    {
        CreateMap<AppUser, AbouteMeDto>()
            .ForMember(des => des.MyNumber, opt => opt.MapFrom(src => src.PhoneNumber));

        CreateMap<AppUser, MyProfileDto>()
            .ForMember(des => des.UserId, opt => opt.MapFrom(src => src.Id))
            .ForMember(des => des.PostCount, opt => opt.MapFrom(src => src.Posts.Count))
            .ForMember(des => des.MyPosts, opt => opt.MapFrom(src => src.Posts))
            .ForMember(des => des.ProfileName, opt => opt.MapFrom(src => src.UserName))
            .ForMember(des => des.CoverImagePath, opt => opt.MapFrom(src => src.CoverPhotoPath))
            .ForMember(des => des.ProfileImagePath, opt => opt.MapFrom(src => src.ProfilePhotoPath))
            ;


    }
}
