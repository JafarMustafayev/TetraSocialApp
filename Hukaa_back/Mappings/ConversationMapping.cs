namespace Hukaa_back.Mappings;

public class ConversationMapping : Profile
{
    public ConversationMapping()
    {
        CreateMap<Conversation, ConversationListItemDto>()
            .ForMember(dest => dest.ConversationId, opt => opt.MapFrom(src => src.Id));


        CreateMap<Message, MessagesListItemDto>()
            .ForMember(dest => dest.MessageId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.SentAt, opt => opt.MapFrom(src => src.CreatedAt))
            .ForMember(dest => dest.Type,
                opt => opt.MapFrom(src => src.PostId != null ? MessageType.PostShare : MessageType.Text));
    }
}