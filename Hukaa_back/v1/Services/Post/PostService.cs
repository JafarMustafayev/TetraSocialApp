namespace Hukaa_back.Services.Post;

public class PostService(
    IFileService fileService,
    ICurrentUserService currentUserService,
    AppDbContext context,
    UserManager<AppUser> userManager,
    IMapper mapper,
    IReactionService reactionService,
    ICommentService commentService) : IPostService
{
    private const int DefaultPageSize = 10;

    private static readonly string[] AllowedVideoExtensions = [".mp4", ".mov", ".avi", ".mkv"];
    private static readonly string[] AllowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp"];

    public async Task<ResponseDto> GetMyPostsAsync(int page, int take)
    {
        var (normalizedPage, normalizedTake) = NormalizePagination(page, take);
        var userId = currentUserService.UserId;

        var query = context.Posts
            .Where(p => p.AppUserId == userId && !p.IsArchived);

        var data = await EnrichPostsAsync(query, userId, normalizedPage, normalizedTake);

        return BuildSuccessResponse(StatusCodes.Status200OK, "Successfully retrieved posts", data);
    }

    public async Task<ResponseDto> GetMyFeedsAsync(int page, int take)
    {
        var (normalizedPage, normalizedTake) = NormalizePagination(page, take);
        var userId = currentUserService.UserId;

        var query = context.Posts
            .Where(post =>
                (!post.IsArchived &&
                 context.Follows.Any(f =>
                     f.FollowerId == userId &&
                     f.FollowingId == post.AppUserId &&
                     f.Status == FollowStatus.Accepted))
                || (!post.IsArchived && post.AppUserId == userId));

        var data = await EnrichPostsAsync(query, userId, normalizedPage, normalizedTake);

        return BuildSuccessResponse(StatusCodes.Status200OK, "Successfully retrieved posts", data);
    }

    public async Task<ResponseDto> GetUserPostsAsync(string userId, int page, int take)
    {
        var (normalizedPage, normalizedTake) = NormalizePagination(page, take);
        var currentUserId = currentUserService.UserId;

        var query = context.Posts
            .Where(p => p.AppUserId == userId && !p.IsArchived);

        var data = await EnrichPostsAsync(query, currentUserId, normalizedPage, normalizedTake);

        return BuildSuccessResponse(StatusCodes.Status200OK, "Successfully retrieved posts", data);
    }

    public async Task<ResponseDto> GetMyArchivedPostsAsync(int page, int take)
    {
        var (normalizedPage, normalizedTake) = NormalizePagination(page, take);
        var userId = currentUserService.UserId;

        var query = context.Posts
            .Where(p => p.AppUserId == userId && p.IsArchived);

        var data = await EnrichPostsAsync(query, userId, normalizedPage, normalizedTake);

        return BuildSuccessResponse(StatusCodes.Status200OK, "Successfully retrieved posts", data);
    }

    public async Task<ResponseDto> GetReactedPostsAsync(int page, int take)
    {
        var (normalizedPage, normalizedTake) = NormalizePagination(page, take);
        var userId = currentUserService.UserId;

        var query = context.Posts
            .Where(post =>
                !post.IsArchived &&
                context.Reactions.Any(r =>
                    r.PostId == post.Id &&
                    r.AppUserId == userId));

        var data = await EnrichPostsAsync(query, userId, normalizedPage, normalizedTake);

        return BuildSuccessResponse(StatusCodes.Status200OK, "Successfully retrieved posts", data);
    }

    public async Task<ResponseDto> GetSavedPostsAsync(int page, int take)
    {
        var (normalizedPage, normalizedTake) = NormalizePagination(page, take);
        var userId = currentUserService.UserId;

        var query = context.Posts
            .Where(p => !p.IsArchived &&
                        context.SavedPosts.Any(s => s.AppUserId == userId && s.PostId == p.Id));

        var data = await EnrichPostsAsync(query, userId, normalizedPage, normalizedTake);

        return BuildSuccessResponse(StatusCodes.Status200OK, "Successfully retrieved posts", data);
    }

    public async Task<ResponseDto> GetByIdAsync(string postId)
    {
        var userId = currentUserService.UserId;

        var post = await context.Posts
            .Include(post => post.PostFiles)
            .Include(post => post.AppUser)
            .Where(post =>
                !post.IsArchived &&
                (post.AppUserId == userId ||
                 post.AppUser.AccountType == AccountType.PublicAccount ||
                 context.Follows.Any(follow =>
                     follow.FollowerId == userId &&
                     follow.FollowingId == post.AppUserId &&
                     follow.Status == FollowStatus.Accepted)))
            .FirstOrDefaultAsync(post => post.Id == postId);

        if(post == null)
        {
            throw new NotFoundException("Post", postId);
        }


        var dto = MapToPostDto(post, userId);

        return BuildSuccessResponse(StatusCodes.Status200OK, "Post retrieved successfully", new { post = dto });
    }

    public async Task<ResponseDto> CreateAsync(PostCreateRequestDto request)
    {
        var userId = currentUserService.UserId;

        var user = await userManager.FindByIdAsync(userId)
                   ?? throw new NotFoundException("User", userId);

        if(request.Files == null &&
           string.IsNullOrWhiteSpace(request.Content))
        {
            throw new BadRequestException("Post content cannot be empty if no files are attached.");
        }

        var post = new Entities.Post
        {
            Content = request.Content,
            AppUser = user,
            CreatedAt = DateTime.Now
        };

        await context.Posts.AddAsync(post);

        if(request.Files is { Count: > 0 })
        {
            await AttachFilesToPostAsync(post, request.Files);
        }

        await context.SaveChangesAsync();

        var dto = MapToPostDto(post, userId);

        return BuildSuccessResponse(StatusCodes.Status201Created, "Successfully created post", new { post = dto });
    }

    public async Task<ResponseDto> UpdateContentAsync(string postId, PostUpdateRequestDto request)
    {
        var userId = currentUserService.UserId;

        var post = await context.Posts
                       .Include(p => p.PostFiles)
                       .Include(p => p.AppUser)
                       .FirstOrDefaultAsync(p => p.Id == postId)
                   ?? throw new NotFoundException("Post", postId);

        if(post.AppUserId != userId)
        {
            throw new UnauthorizedAccessException("You cannot edit this post.");
        }

        if(post.PostFiles != null &&
           string.IsNullOrWhiteSpace(request.Content))
        {
            throw new BadRequestException("Post content cannot be empty if no files are attached.");
        }

        if(post.Content != request.Content)
        {
            post.Content = request.Content;
            await context.SaveChangesAsync();
        }

        var dto = MapToPostDto(post, userId);

        return BuildSuccessResponse(StatusCodes.Status200OK, "Successfully updated post", new { post = dto });
    }

    public async Task<ResponseDto> DeleteAsync(string postId)
    {
        var userId = currentUserService.UserId;

        var post = await context.Posts
                       .Include(p => p.PostFiles)
                       .FirstOrDefaultAsync(p => p.Id == postId)
                   ?? throw new NotFoundException("Post", postId);

        if(post.AppUserId != userId)
        {
            throw new UnauthorizedAccessException("You cannot delete this post.");
        }

        post.DeleteAt = DateTime.Now;
        post.IsDeleted = true;

        if(post.PostFiles is { Count: > 0 })
        {
            await DeletePostFilesAsync(post.PostFiles);
        }

        await context.SaveChangesAsync();

        return BuildSuccessResponse(StatusCodes.Status200OK, "Post deleted successfully");
    }

    public async Task<ResponseDto> ToggleArchiveAsync(string postId, TogglePostArchiveStatusDto request)
    {
        var userId = currentUserService.UserId;

        var post = await context.Posts
                       .FirstOrDefaultAsync(p => p.Id == postId)
                   ?? throw new NotFoundException("Post", postId);

        if(post.AppUserId != userId)
        {
            throw new UnauthorizedException("You cannot archive/unarchive this post.");
        }

        post.IsArchived = request.IsArchive;
        await context.SaveChangesAsync();

        var message = request.IsArchive
            ? "Post archived successfully"
            : "Post unarchived successfully";

        return BuildSuccessResponse(StatusCodes.Status200OK, message);
    }

    public async Task<ResponseDto> ToggleSavedAsync(string postId)
    {
        var userId = currentUserService.UserId;

        var post = await context.Posts
                       .FirstOrDefaultAsync(p => p.Id == postId)
                   ?? throw new NotFoundException("Post", postId);

        var savedPost = await context.SavedPosts
            .FirstOrDefaultAsync(s => s.AppUserId == userId && s.PostId == postId);

        if(savedPost is null)
        {
            await context.SavedPosts.AddAsync(new SavedPost
            {
                AppUserId = userId,
                PostId = postId
            });
        }
        else
        {
            context.SavedPosts.Remove(savedPost);
        }

        await context.SaveChangesAsync();

        var message = savedPost is null
            ? "Post saved successfully"
            : "Post unsaved successfully";

        return BuildSuccessResponse(StatusCodes.Status200OK, message);
    }

    private static (int page, int take) NormalizePagination(int page, int take)
    {
        if(page < 1)
        {
            page = 1;
        }

        if(take < 1)
        {
            take = DefaultPageSize;
        }

        return (page, take);
    }

    private async Task<List<SinglePostDto>> EnrichPostsAsync(
        IQueryable<Entities.Post> query,
        string currentUserId,
        int page,
        int take)
    {
        var posts = await query
            .AsNoTracking()
            .Include(p => p.PostFiles)
            .Include(p => p.AppUser)
            .Include(p => p.SavedPosts)
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * take)
            .Take(take)
            .ToListAsync();

        var dtos = mapper.Map<List<SinglePostDto>>(posts);

        if(!dtos.Any())
        {
            return dtos;
        }

        var postIds = dtos.Select(d => d.Id).ToList();

        var commentCounts = await commentService.GetCommentCountAsync(postIds);
        var reactionCounts = await reactionService.GetReactionCountsAsync(postIds);
        var myReactions = await reactionService.GetMyReactionsAsync(postIds);

        var savedPostIds = posts
            .Where(p => p.SavedPosts.Any(s => s.AppUserId == currentUserId))
            .Select(p => p.Id)
            .ToHashSet();

        foreach (var dto in dtos)
        {
            dto.TotalReactionCount = reactionCounts.GetValueOrDefault(dto.Id, 0);
            dto.MyReaction = myReactions.GetValueOrDefault(dto.Id);
            dto.CommentCount = commentCounts.GetValueOrDefault(dto.Id, 0);
            dto.IsSaved = savedPostIds.Contains(dto.Id);
        }

        SetOwnerFlags(dtos, currentUserId);

        return dtos;
    }

    private SinglePostDto MapToPostDto(Entities.Post post, string currentUserId)
    {
        var dto = mapper.Map<SinglePostDto>(post);
        dto.PostFiles = mapper.Map<List<PostFileDto>>(post.PostFiles);
        SetOwnerFlag(dto, currentUserId);
        return dto;
    }

    private async Task AttachFilesToPostAsync(Entities.Post post, IEnumerable<IFormFile> files)
    {
        var postFiles = new List<PostFile>();

        foreach (var file in files)
            postFiles.Add(new PostFile
            {
                Post = post,
                FileName = file.FileName,
                FilePath = await fileService.UploadPostAsync(file),
                FileExtension = Path.GetExtension(file.FileName),
                FileType = ResolveFileType(file.FileName),
                DeletedAt = null
            });

        await context.PostFiles.AddRangeAsync(postFiles);
    }

    private async Task DeletePostFilesAsync(IEnumerable<PostFile> files)
    {
        foreach (var file in files)
        {
            await fileService.DeleteFileAsync(file.FilePath);
            file.IsDeleted = true;
            file.DeletedAt = DateTime.Now;
        }
    }

    private static FileType ResolveFileType(string fileName)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        return AllowedImageExtensions.Contains(extension)
            ? FileType.Image
            : FileType.Video;
    }

    private static void SetOwnerFlag(SinglePostDto dto, string currentUserId)
    {
        dto.IsOwner = dto.UserId == currentUserId;
    }

    private static void SetOwnerFlags(IEnumerable<SinglePostDto> dtos, string currentUserId)
    {
        foreach (var dto in dtos)
            SetOwnerFlag(dto, currentUserId);
    }

    private static ResponseDto BuildSuccessResponse(int statusCode, string message, object? data = null)
    {
        return new ResponseDto
        {
            Success = true,
            Message = message,
            StatusCode = statusCode,
            Data = data
        };
    }
}