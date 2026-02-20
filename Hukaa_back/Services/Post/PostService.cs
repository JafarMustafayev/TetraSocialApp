namespace Hukaa_back.Services.Post;

public class PostService(IFileService fileService,
    ICurrentUserService currentUserService,
    AppDbContext context,
    UserManager<AppUser> userManager,
    IMapper mapper,
    IReactionService reactionService) : IPostService
{
    private readonly string[] _allowedVideoExtensions = { ".mp4", ".mov", ".avi", ".mkv" };
    private readonly string[] _allowedImageExtensions = { ".jpg", ".jpeg", ".png", ".webp" };

    public async Task<ResponseDto> GetMyPosts(int page, int take)
    {
        var userId = currentUserService.UserId;

        var posts = await context.Posts
            .Where(x => x.AppUserId == userId && !x.IsArchived)
            .Include(x => x.PostFiles)
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * take)
            .Take(take)
            .ToListAsync();

        var map = mapper.Map<List<SinglePostDto>>(posts);

        var postIds = map.Select(x => x.Id).ToList();

        var reactionCounts = await reactionService.GetReactionCountsAsync(postIds);
        var myReactions = await reactionService.GetMyReactionsAsync(postIds);

        foreach (var post in map)
        {
            post.TotalReactionCount = reactionCounts.ContainsKey(post.Id)
                ? reactionCounts[post.Id]
                : 0;

            post.MyReaction = myReactions.ContainsKey(post.Id)
                ? myReactions[post.Id]
                : null;
        }

        SetPostPermissions(map, userId);

        return new()
        {
            Success = true,
            Message = "",
            StatusCode = StatusCodes.Status200OK,
            Data = map
        };
    }

    public async Task<ResponseDto> GetMyArchivedPosts(int page, int take)
    {

        var userId = currentUserService.UserId;

        var posts = await context.Posts
            .Where(x => x.AppUserId == userId && x.IsArchived)
            .Include(x => x.PostFiles)
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * take).Take(take)
            .ToListAsync();

        var map = mapper.Map<List<SinglePostDto>>(posts);

        SetPostPermissions(map, userId);

        return new()
        {
            Success = true,
            Message = "",
            StatusCode = StatusCodes.Status200OK,
            Data = map
        };
    }

    public async Task<ResponseDto> CreateAsync(PostCreateRequestDto request)
    {
        var userId = currentUserService.UserId;
        var user = await userManager.FindByIdAsync(userId);
        if (user == null) throw new NotFoundException("User", userId);

        if (request.Files.Count == 0 && string.IsNullOrWhiteSpace(request.Content))
            throw new BadRequestException("Post content cannot be empty if no files are attached.");

        var post = new Entities.Post
        {
            Content = request.Content,
            AppUser = user,
            CreatedAt = DateTime.UtcNow
        };

        await context.Posts.AddAsync(post);

        if (request.Files.Count > 0)
        {
            var postFiles = new List<PostFile>();
            foreach (var file in request.Files)
            {
                postFiles.Add(new PostFile
                {
                    Post = post,
                    FileName = file.FileName,
                    FilePath = await fileService.UploadPostAsync(file),
                    FileExtension = Path.GetExtension(file.FileName),
                    FileType = GetFileType(file.FileName),
                    DeletedAt = null
                });
            }
            await context.PostFiles.AddRangeAsync(postFiles);
        }

        await context.SaveChangesAsync();

        var dto = mapper.Map<SinglePostDto>(post);
        dto.PostFiles = mapper.Map<List<PostFileDto>>(post.PostFiles);
        SetPostPermissions(dto, userId);

        return new ResponseDto
        {
            Success = true,
            Message = "Successfully created post",
            StatusCode = StatusCodes.Status201Created,
            Data = new { post = dto }
        };
    }

    public async Task<ResponseDto> UpdateContentAsync(string postId, PostUpdateRequestDto request)
    {
        var userId = currentUserService.UserId;
        var post = await context.Posts
            .Include(p => p.PostFiles)
            .Include(p => p.AppUser)
            .FirstOrDefaultAsync(x => x.Id == postId);

        if (post == null) throw new NotFoundException("Post", postId);
        if (post.AppUserId != userId) throw new UnauthorizedAccessException("You cannot edit this post.");

        if (post.PostFiles.Count == 0 && string.IsNullOrWhiteSpace(request.Content))
            throw new BadRequestException("Post content cannot be empty if no files are attached.");

        if (post.Content != request.Content)
        {
            post.Content = request.Content;
            await context.SaveChangesAsync();
        }

        var dto = mapper.Map<SinglePostDto>(post);
        dto.PostFiles = mapper.Map<List<PostFileDto>>(post.PostFiles);
        SetPostPermissions(dto, userId);

        return new ResponseDto
        {
            Success = true,
            Message = "Successfully updated post",
            StatusCode = StatusCodes.Status200OK,
            Data = new { post = dto }
        };
    }

    public async Task<ResponseDto> DeleteAsync(string postId)
    {
        var userId = currentUserService.UserId;
        var post = await context.Posts
            .Include(p => p.PostFiles)
            .FirstOrDefaultAsync(x => x.Id == postId);

        if (post == null) throw new NotFoundException("Post", postId);
        if (post.AppUserId != userId) throw new UnauthorizedAccessException("You cannot delete this post.");

        post.DeleteAt = DateTime.UtcNow;
        post.IsDeleted = true;


        if (post.PostFiles.Count > 0) {

            foreach (var file in post.PostFiles)
            {
                await fileService.DeleteFileAsync(file.FilePath);
                file.IsDeleted = true;
                file.DeletedAt = DateTime.UtcNow;
            }
        }


        await context.SaveChangesAsync();

        return new ResponseDto
        {
            Success = true,
            Message = "Post deleted successfully",
            StatusCode = StatusCodes.Status200OK
        };
    }

    public async Task<ResponseDto> ToggleArchiveAsync(string postId, TogglePostArchiveStatusDto request)
    {
        var userId = currentUserService.UserId;
        var post = await context.Posts.FirstOrDefaultAsync(x => x.Id == postId);

        if (post == null) throw new NotFoundException("Post", postId);
        if (post.AppUserId != userId) throw new UnauthorizedAccessException("You cannot archive/unarchive this post.");

        post.IsArchived = request.IsArchive;
        await context.SaveChangesAsync();

        return new ResponseDto
        {
            Success = true,
            Message = request.IsArchive ? "Post archived successfully" : "Post unarchived successfully",
            StatusCode = StatusCodes.Status200OK
        };
    }

    // GET BY ID
    public async Task<ResponseDto> GetByIdAsync(string postId)
    {
        var userId = currentUserService.UserId;
        var post = await context.Posts
            .Include(p => p.PostFiles)
            .Include(p => p.AppUser)
            .FirstOrDefaultAsync(x => x.Id == postId);

        if (post == null) throw new NotFoundException("Post", postId);

        var dto = mapper.Map<SinglePostDto>(post);
        dto.PostFiles = mapper.Map<List<PostFileDto>>(post.PostFiles);
        SetPostPermissions(dto, userId);

        return new ResponseDto
        {
            Success = true,
            Message = "Post retrieved successfully",
            StatusCode = StatusCodes.Status200OK,
            Data = new { post = dto }
        };
    }

    private FileType GetFileType(string fileName)
    {
        var ext = Path.GetExtension(fileName).ToLower();
        return _allowedImageExtensions.Contains(ext) ? FileType.Image : FileType.Video;
    }

    private void SetPostPermissions(SinglePostDto dto, string currentUserId)
    {
        dto.IsOwner = dto.UserId == currentUserId;
    }

    private void SetPostPermissions(List<SinglePostDto> list, string currentUserId)
    {
        foreach (var dto in list) 
        {
            dto.IsOwner = dto.UserId == currentUserId;
        }
    }
}
