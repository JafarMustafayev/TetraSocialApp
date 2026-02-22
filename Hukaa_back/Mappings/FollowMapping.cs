namespace Hukaa_back.Mappings;

public class FollowMapping:Profile
{
    public FollowMapping()
    {
        // Followers
        CreateMap<Follow, FollowerDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Follower.Id))
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Follower.UserName))
            .ForMember(dest => dest.ProfileImageUrl, opt => opt.MapFrom(src => src.Follower.ProfilePhotoPath));

        // Followings
        CreateMap<Follow, FollowingDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Following.Id))
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Following.UserName))
            .ForMember(dest => dest.ProfileImageUrl, opt => opt.MapFrom(src => src.Following.ProfilePhotoPath));
    }

}