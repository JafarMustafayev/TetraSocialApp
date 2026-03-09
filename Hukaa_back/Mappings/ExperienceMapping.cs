namespace Hukaa_back.Mappings;

public class Experiencemapping : Profile
{
    public Experiencemapping()
    {
        CreateMap<WorkExperience, ExperienceDataDto>()
            .ForMember(des => des.Position, opt => opt.MapFrom(src => src.Title));

        CreateMap<CreateExperienceDto, WorkExperience>()
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Position))
            .ForMember(dest => dest.StartAt, opt => opt.MapFrom(src => src.StartDate))
            .ForMember(dest => dest.EndAt, opt => opt.MapFrom(src => src.EndDate))
            .ForMember(dest => dest.IsCurrent,
                opt => opt.MapFrom(src => src.EndDate == null ? true : src.EndDate > DateTime.Now.Date));

        CreateMap<UpdateExperienceDto, WorkExperience>()
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Position))
            .ForMember(dest => dest.StartAt, opt => opt.MapFrom(src => src.StartDate))
            .ForMember(dest => dest.EndAt, opt => opt.MapFrom(src => src.EndDate))
            .ForMember(dest => dest.IsCurrent, opt => opt.MapFrom(src => src.EndDate == null))
            .ForMember(dest => dest.IsCurrent,
                opt => opt.MapFrom(src => src.EndDate == null ? true : src.EndDate > DateTime.Now.Date));
    }
}