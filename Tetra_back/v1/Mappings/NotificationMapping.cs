namespace Hukaa_back.Mappings;

public class NotificationMapping : Profile
{
    public NotificationMapping()
    {
        CreateMap<Notification, SingleNotificationDto>()
            .ForMember(dest => dest.NotificationId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Payload, opt => opt.MapFrom(src => src.PayloadJson));
    }
}