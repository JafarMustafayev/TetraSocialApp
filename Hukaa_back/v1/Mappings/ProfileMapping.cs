namespace Hukaa_back.Mappings;

public class ProfileMapping : Profile
{
    public ProfileMapping()
    {
        CreateMap<AppUser, ProfileSummaryDto>()
            .ForMember(des => des.UserId, opt => opt.MapFrom(src => src.Id))
            .ForMember(des => des.ProfileName, opt => opt.MapFrom(src => src.UserName))
            .ForMember(des => des.PostCount, opt => opt.MapFrom(src => src.Posts.Count))
            .ForMember(des => des.CoverImagePath, opt => opt.MapFrom(src => src.CoverPhotoPath))
            .ForMember(des => des.IsPrivateProfile,
                opt => opt.MapFrom(src => src.AccountType == AccountType.PrivateAccount))
            .ForMember(des => des.ProfileImagePath, opt => opt.MapFrom(src => src.ProfilePhotoPath));

        CreateMap<AppUser, ProfileDetailsDto>()
            .ForMember(des => des.UserId, opt => opt.MapFrom(src => src.Id))
            .ForMember(des => des.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
            .ForMember(des => des.ProfileName, opt => opt.MapFrom(src => src.UserName))
            .ForMember(des => des.PostCount, opt => opt.MapFrom(src => src.Posts.Count))
            .ForMember(des => des.CoverImagePath, opt => opt.MapFrom(src => src.CoverPhotoPath))
            .ForMember(des => des.IsPrivateProfile,
                opt => opt.MapFrom(src => src.AccountType == AccountType.PrivateAccount))
            .ForMember(des => des.ProfileImagePath, opt => opt.MapFrom(src => src.ProfilePhotoPath));

        CreateMap<UpdateProfileInformationDto, AppUser>();
        CreateMap<AppUser, UserPreviewDto>()
            .ForMember(des => des.ProfileImageUrl, opt => opt.MapFrom(src => src.ProfilePhotoPath));
    }
}