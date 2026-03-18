namespace Hukaa_back.Mappings;

public class DasboardMapping:Profile
{
    public DasboardMapping()
    {
        CreateMap<AppUser, AdminUsersListItemDto>()
            .ForMember(dest => dest.CreateAt, opt => opt.MapFrom(src => src.CreatedAt.ToString("yyyy-MM-dd")))
            .ForMember(dest => dest.ProfilePicture, opt => opt.MapFrom(src => src.ProfilePhotoPath))
            .ForMember(dest => dest.PostsCount, opt => opt.MapFrom(src => (src.Posts != null ? src.Posts.Count :0)))
            .ForMember(dest => dest.IsBanned, opt => opt.MapFrom(src => src.UserStatus == UserStatus.Banned ? true:false));

        CreateMap<Post, AdminPostListItemDto>()
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
            .ForMember(dest => dest.PostFiles, opt => opt.MapFrom(src =>  src.PostFiles))
            .ForMember(dest => dest.ShareCount, opt => opt.MapFrom(src =>  src.ShareCounter))
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.AppUser.UserName))
            .ForMember(dest => dest.CommentCount, opt => opt.MapFrom(src => src.Comments != null ? src.Comments.Count : 0))
            .ForMember(dest => dest.TotalReactionCount, opt => opt.MapFrom(src => src.Reactions != null ? src.Reactions.Count : 0));
    }
}
