namespace Hukaa_back.Abstractions.Services.Conversation;

public interface IConversationService
{
    Task<ResponseDto> GetConversationListAsync(int pageNumber, int pageSize = 30);
    Task<ResponseDto> GetConversationMessagesAsync(string conversationId, int page, int take);
    Task SendMessageAsync(SendMessageRequestDto request);
    Task<ResponseDto> DeleteConversationAsync(string conversationId);
    Task MarkAsReadAsync(string conversationId);
}