namespace Hukaa_back.Services.Conversation;

public class ConversationService(
    AppDbContext context,
    ICurrentUserService currentUser,
    IMapper mapper,
    IOnlineUserTracker onlineUserTracker,
    IHubContext<ChatHub, IChatHubClient> hubContext) : IConversationService
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

    public async Task<ResponseDto> GetConversationMessagesAsync(string conversationId, int page, int take)
    {
        if(take < 1)
        {
            take = 30;
        }

        if(page < 1)
        {
            page = 1;
        }

        var messages = await context.Messages
            .Where(m => m.ConversationId == conversationId)
            .OrderByDescending(m => m.CreatedAt)
            .Skip((page - 1) * take)
            .Take(take)
            .ToListAsync();

        await MarkAsReadAsync(conversationId);
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
        conversation.DeletedAt = DateTime.Now;
        await context.SaveChangesAsync();

        return new ResponseDto
        {
            StatusCode = StatusCodes.Status200OK,
            Message = "Conversation deleted successfully",
            Success = true
        };
    }

    public async Task SendMessageAsync(SendMessageRequestDto request)
    {
        var currentUserId = currentUser.UserId;
        var receiverExists = await context.Users
            .AnyAsync(x => x.Id == request.ReceiverId);

        if(!receiverExists)
        {
            throw new HubException($"User with key '{request.ReceiverId}' was not found");
        }

        string conversationId;
        if(!string.IsNullOrWhiteSpace(request.ConversationId))
        {
            var conversationExists = await context.Conversations
                .AnyAsync(c =>
                    c.Id == request.ConversationId &&
                    ((c.InitiatorId == currentUserId && c.RecipientId == request.ReceiverId) ||
                     (c.InitiatorId == request.ReceiverId && c.RecipientId == currentUserId)));

            if(!conversationExists)
            {
                throw new HubException($"Conversation with key '{request.ConversationId}' was not found");
            }

            conversationId = request.ConversationId;
        }
        else
        {
            var conversation = new Entities.Conversation
            {
                InitiatorId = currentUserId,
                RecipientId = request.ReceiverId
            };
            await context.Conversations.AddAsync(conversation);
            conversationId = conversation.Id;
        }

        var message = new Message
        {
            Content = request.Content,
            ConversationId = conversationId,
            SenderId = currentUserId,
            PostId = request.PostId,
            MessageType = request.PostId == null
                ? MessageType.Text
                : MessageType.PostShare
        };

        await context.Messages.AddAsync(message);
        await context.SaveChangesAsync();

        var messageDto = mapper.Map<MessagesListItemDto>(message);
        if(onlineUserTracker.IsOnline(request.ReceiverId))
        {
            await hubContext
                .Clients
                .User(request.ReceiverId)
                .ReceiveMessage(messageDto);
        }

        if(onlineUserTracker.IsOnline(currentUserId))
        {
            messageDto.IsOwner = true;
            await hubContext
                .Clients
                .User(currentUserId)
                .ReceiveMessage(messageDto);
        }
    }

    // helper methods
    public async Task MarkAsReadAsync(string conversationId)
    {
        var currentUserId = currentUser.UserId;

        await context.Messages
            .Where(m => m.ConversationId == conversationId &&
                        m.SenderId != currentUserId &&
                        !m.IsRead)
            .ExecuteUpdateAsync(setters =>
                setters.SetProperty(m => m.IsRead, true));

        var conversation = await context.Conversations
            .FirstOrDefaultAsync(c => c.Id == conversationId);

        var receiverId = conversation?.RecipientId == currentUserId
            ? conversation?.InitiatorId
            : conversation?.RecipientId;
        await hubContext.Clients.User(receiverId ?? "").MessagesRead(new MarkAsReadDto
        {
            ConversationId = conversationId
        });
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