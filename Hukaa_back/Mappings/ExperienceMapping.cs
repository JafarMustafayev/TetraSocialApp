namespace Hukaa_back.Mappings;

public class Experiencemapping:Profile
{
    public Experiencemapping()
    {
        CreateMap<WorkExperience, ExperienceDataDto>()
            .ForMember(des=>des.Position,opt=>opt.MapFrom(src=>src.Title));
        
        CreateMap<CreateExperienceDto,WorkExperience>()
            .ForMember(des=>des.Title, opt => opt.MapFrom(src=>src.Position));
        CreateMap<UpdateExperienceDto, WorkExperience>()
            .ForMember(des => des.Title, opt => opt.MapFrom(src => src.Position));

    }
}
