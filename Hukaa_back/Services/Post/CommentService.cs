namespace Hukaa_back.Services.Post;

public class CommentService(
    AppDbContext context,
    IMapper mapper,
    ICurrentUserService currentUserService,
    UserManager<AppUser> userManager,
    INotificationService notificationService) : ICommentService
{
    public async Task<ResponseDto> CreateCommentAsync(CommentCreateDto dto)
    {
        var user = await userManager.FindByIdAsync(currentUserService.UserId);
        var post = await context.Posts.FirstOrDefaultAsync(x => x.Id == dto.PostId);

        if(user == null)
        {
            throw new NotFoundException("User", currentUserService.UserId);
        }

        if(post == null)
        {
            throw new NotFoundException("Post", dto.PostId);
        }

        var comment = new Comment
        {
            AppUser = user,
            Post = post,
            Content = dto.Content
        };

        context.Comments.Add(comment);
        await context.SaveChangesAsync();
        await notificationService.SendCommentNotificationAsync(
            comment.PostId,
            comment.Id,
            comment.Content,
            post.AppUserId);

        var commentDto = mapper.Map<CommentDto>(comment);
        commentDto.IsOwner = true;

        return new ResponseDto
        {
            Success = true,
            StatusCode = StatusCodes.Status201Created,
            Message = "Comment created successfully",
            Data = commentDto
        };
    }

    public async Task<ResponseDto> UpdateCommentAsync(string commentId, UpdateCommentDto dto)
    {
        var user = await userManager.FindByIdAsync(currentUserService.UserId);

        if(user == null)
        {
            throw new NotFoundException("User", currentUserService.UserId);
        }

        var comment = await context.Comments.FirstOrDefaultAsync(x => x.Id == commentId && x.AppUserId == user.Id);
        if(comment == null)
        {
            throw new NotFoundException("Comment", commentId);
        }

        mapper.Map(dto, comment);

        await context.SaveChangesAsync();

        var commentDto = mapper.Map<CommentDto>(comment);
        commentDto.IsOwner = true;

        return new ResponseDto
        {
            Success = true,
            StatusCode = StatusCodes.Status200OK,
            Message = "Comment updated successfully",
            Data = commentDto
        };

        throw new NotImplementedException();
    }

    public async Task<ResponseDto> DeleteCommentAsync(string commentId)
    {
        var userId = currentUserService.UserId;
        var comment = await context.Comments.FirstOrDefaultAsync(x => x.Id == commentId);

        if(comment == null || comment.AppUserId != userId)
        {
            throw new NotFoundException("Comment", commentId);
        }

        comment.IsDeleted = true;
        comment.DeletedAt = DateTime.UtcNow;
        await context.SaveChangesAsync();

        return new ResponseDto
        {
            Success = true,
            StatusCode = StatusCodes.Status204NoContent,
            Message = "Comment deleted successfully"
        };
    }

    public async Task<ResponseDto> GetPostCommentsAsync(string postId)
    {
        var comments = await context.Comments
            .Where(c => c.PostId == postId && !c.IsDeleted)
            .Select(c => new CommentDto
            {
                Id = c.Id,
                PostId = c.PostId,
                AppUserId = c.AppUserId,
                Content = c.Content,
                CreatedAt = c.CreatedAt,
                IsOwner = c.AppUserId == currentUserService.UserId,
                UserId = c.AppUser.Id,
                UserImage = c.AppUser.ProfilePhotoPath,
                UserName = c.AppUser.UserName ?? "UserName"
            })
            .ToListAsync();

        var commentMaps = mapper.Map<List<CommentDto>>(comments);

        var userId = currentUserService.UserId;
        // Owner check
        foreach (var dto in commentMaps)
            dto.IsOwner = dto.AppUserId == userId;

        return new ResponseDto
        {
            Success = true,
            StatusCode = StatusCodes.Status200OK,
            Message = "Comments retrieved successfully",
            Data = commentMaps
        };
    }

    public async Task<Dictionary<string, int>> GetCommentCountAsync(List<string> postIds)
    {
        return await context.Comments
            .Where(r => postIds.Contains(r.PostId))
            .GroupBy(r => r.PostId)
            .Select(g => new
            {
                PostId = g.Key,
                Count = g.Count()
            })
            .ToDictionaryAsync(x => x.PostId, x => x.Count);
    }
}