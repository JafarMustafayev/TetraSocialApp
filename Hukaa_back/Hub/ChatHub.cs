namespace Hukaa_back.Hub;

public class ChatHub(
    IOnlineUserTracker tracker,
    ICurrentUserService currentUser,
    IConversationService conversationService,
    IValidator<SendMessageRequestDto> sendMessageValidator,
    IValidator<ConversationActionDto> markAsReadValidator)
    : BaseHub<IChatHubClient>(tracker, currentUser)
{
    public override async Task OnConnectedAsync()
    {
        tracker.AddConnection(currentUser.UserId, Context.ConnectionId);
        await Clients.All.UserOnline(currentUser.UserId);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        tracker.RemoveConnection(currentUser.UserId, Context.ConnectionId);
        if(!tracker.IsOnline(currentUser.UserId))
        {
            await Clients.All.UserOffline(currentUser.UserId);
        }

        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(SendMessageRequestDto request)
    {
        await ValidateAsync(request, sendMessageValidator);
        await conversationService.SendMessageAsync(request);
    }

    public async Task MarkAsRead(ConversationActionDto request)
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