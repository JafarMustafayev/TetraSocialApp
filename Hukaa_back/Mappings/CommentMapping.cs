namespace Hukaa_back.Mappings;

public class CommentMapping:Profile
{
    public CommentMapping()
    {
        CreateMap<Comment,CommentDto>()
            .ForMember(des=>des.UserId ,opt=>opt.MapFrom(src=>src.AppUser.Id))
            .ForMember(des=>des.UserName ,opt=>opt.MapFrom(src=>src.AppUser.UserName))
            .ForMember(des=>des.UserImage ,opt=>opt.MapFrom(src=>src.AppUser.ProfilePhotoPath));

        CreateMap<UpdateCommentDto, Comment>();

    }

    
}
