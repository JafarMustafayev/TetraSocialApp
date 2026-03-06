namespace Hukaa_back.Hub;

public class ChatHub(
    IOnlineUserTracker tracker,
    ICurrentUserService currentUser,
    IConversationService conversationService,
    IValidator<SendMessageRequestDto> sendMessageValidator,
    IValidator<MarkAsReadDto> markAsReadValidator)
    : BaseHub<IChatHubClient>(tracker, currentUser)
{
    public async Task SendMessage(SendMessageRequestDto request)
    {
        await ValidateAsync(request, sendMessageValidator);
        await conversationService.SendMessageAsync(request);
    }

    public async Task MarkAsRead(MarkAsReadDto request)
    {
        await ValidateAsync(request, markAsReadValidator);
        await conversationService.MarkAsReadAsync(request.ConversationId);
    }

    private async Task ValidateAsync<T>(T model, IValidator<T> validator)
    {
        var res = await validator.ValidateAsync(model);
        if(!res.IsValid)
        {
            var errors = string.Join(", ", res.Errors.Select(x => x.ErrorMessage));
            throw new HubException(errors);
        }
    }
}