namespace Hukaa_back.Services.Conversation;

public class ConversationService(
    AppDbContext context,
    ICurrentUserService currentUser,
    IMapper mapper) : IConversationService
{
    public async Task<ResponseDto> GetConversationListAsync(int pageNumber, int pageSize)
    {
        var conversations = await context.Conversations
            .Include(conversation => conversation.Messages)
            .Include(conversation => conversation.Initiator)
            .Include(conversation => conversation.Recipient)
            .Where(conversation =>
                conversation.InitiatorId == currentUser.UserId ||
                conversation.RecipientId == currentUser.UserId)
            .ToListAsync();

        var mapConversation = mapper.Map<List<ConversationListItemDto>>(conversations);

        var counts = await GetUnreadCountAsync(
            mapConversation.Select(conversation => conversation.ConversationId)
                .ToList());

        var users = GetMappedUsers(
            conversations.Select(conversation => (
                conversation.Id,
                conversation.InitiatorId == currentUser.UserId
                    ? conversation.Recipient
                    : conversation.Initiator
            )).ToList());

        var lastMessages = GetMappedLastMessages(
            conversations.Select(conversation => (
                conversation.Id,
                conversation.Messages.ToList()
            )).ToList());

        foreach (var conversation in mapConversation)
        {
            conversation.UnreadMessagesCount = counts.GetValueOrDefault(conversation.ConversationId, 0);
            conversation.User = users.GetValueOrDefault(conversation.ConversationId, null);
            conversation.LastMessage = lastMessages.GetValueOrDefault(conversation.ConversationId, null);
        }

        mapConversation = mapConversation
            .OrderByDescending(conversation =>
                conversation.LastMessage.SentAt).ToList();


        return new ResponseDto
        {
            StatusCode = StatusCodes.Status200OK,
            Message = "User conversations retrieved successfully",
            Data = mapConversation
        };
    }

    public async Task<ResponseDto> GetConversationMessagesAsync(string conversationId, int page,int take)
    {
        if(take < 1)
        {
            take = 30;
        }

        if (page < 1)
        {
            page = 1;
        }

        var messages = await context.Messages
            .Where(m => m.ConversationId == conversationId)
            .OrderBy(m => m.CreatedAt)
            .Skip((page - 1) * take)
            .Take(take)
            .ToListAsync();

        await MarkAsReadAsync(messages);
        var map = mapper.Map<List<MessagesListItemDto>>(messages);
        map.ForEach(m => m.IsOwner = m.SenderId == currentUser.UserId);


        return new ResponseDto
        {
            StatusCode = StatusCodes.Status200OK,
            Message = "User messages retrieved successfully",
            Data = map
        };
    }

    public async Task<ResponseDto> DeleteConversationAsync(string conversationId)
    {
        var currentUserId = currentUser.UserId;
        var conversation = await context.Conversations
            .FirstOrDefaultAsync(c => c.Id == conversationId);

        if(conversation is null)
        {
            throw new NotFoundException("Conversation", conversationId);
        }

        if(conversation.InitiatorId != currentUserId &&
           conversation.RecipientId != currentUserId)
        {
            throw new UnauthorizedException("You are not authorized to delete this conversation.");
        }

        conversation.IsDeleted = true;
        conversation.DeletedAt = DateTime.UtcNow;
        await context.SaveChangesAsync();

        return new ResponseDto
        {
            StatusCode = StatusCodes.Status200OK,
            Message = "Conversation deleted successfully",
            Success = true
        };
    }

    public async Task MarkAsReadAsync(List<Message> messages)
    {
        messages.ForEach(message =>
        {
            if (message.SenderId != currentUser.UserId && !message.IsRead)
            {
                message.IsRead = true;
            }
        });
        await context.SaveChangesAsync();

    }

    private async Task<int> GetUnreadCountAsync(string conversationId)
    {
        var currentUserId = currentUser.UserId;
        var count = await context.Messages
            .Where(message =>
                message.ConversationId == conversationId &&
                message.SenderId != currentUserId &&
                !message.IsRead).CountAsync();
        return count;
    }

    private async Task<Dictionary<string, int>> GetUnreadCountAsync(List<string> conversationIds)
    {
        return await context.Messages
            .Where(message =>
                conversationIds.Contains(message.ConversationId) &&
                message.SenderId != currentUser.UserId &&
                !message.IsRead)
            .GroupBy(message => message.ConversationId)
            .Select(g => new
            {
                ConversationId = g.Key,
                Count = g.Count()
            })
            .ToDictionaryAsync(x => x.ConversationId, x => x.Count);
    }

    private Dictionary<string, UserPreviewDto> GetMappedUsers(
        List<(string conversationId, AppUser user)> datas)
    {
        var returnData = new Dictionary<string, UserPreviewDto>();
        foreach (var tuple in datas)
        {
            var map = mapper.Map<UserPreviewDto>(tuple.user);
            returnData.Add(tuple.conversationId, map);
        }

        return returnData;
    }

    private Dictionary<string, MessagesListItemDto> GetMappedLastMessages(
        List<(string conversationId, List<Message> messages)> datas)
    {
        var returnData = new Dictionary<string, MessagesListItemDto>();
        foreach (var tuple in datas)
        {
            var lastMessages = tuple.messages.OrderByDescending(l => l.CreatedAt).FirstOrDefault();
            var map = mapper.Map<MessagesListItemDto>(lastMessages);
            map.IsOwner = lastMessages?.SenderId == currentUser.UserId;
            returnData.Add(tuple.conversationId, map);
        }

        return returnData;
    }
}