namespace Hukaa_back.Mappings;

public class PostMapping:Profile
{
    public PostMapping()
    {
        CreateMap<Post, SinglePostDto>()
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.AppUserId))
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.AppUser.UserName))
            .ForMember(dest => dest.UserImage, opt => opt.MapFrom(src => src.AppUser.ProfilePhotoPath))
            .ForMember(dest => dest.ShareCount, opt => opt.MapFrom(src => src.ShareCounter));
            
    }
}
