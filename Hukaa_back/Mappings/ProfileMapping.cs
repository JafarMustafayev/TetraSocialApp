namespace Hukaa_back.Mappings;

public class ProfileMapping:Profile
{
    public ProfileMapping()
    {
        CreateMap<AppUser, MyProfileDto>()
            .ForMember(des => des.UserId, opt => opt.MapFrom(src => src.Id))
            .ForMember(des => des.MyPosts, opt => opt.MapFrom(src => src.Posts))
            .ForMember(des => des.MyNumber, opt => opt.MapFrom(src => src.PhoneNumber))
            .ForMember(des => des.ProfileName, opt => opt.MapFrom(src => src.UserName))
            .ForMember(des => des.PostCount, opt => opt.MapFrom(src => src.Posts.Count))
            .ForMember(des => des.CoverImagePath, opt => opt.MapFrom(src => src.CoverPhotoPath))
            .ForMember(des => des.ProfileImagePath, opt => opt.MapFrom(src => src.ProfilePhotoPath));

        CreateMap<UpdateProfileInformationDto, AppUser>();
            
    }
}
