namespace Hukaa_back.Services.Post;

public class PostService(IFileService fileService,
    ICurrentUserService currentUserService,
    AppDbContext context,
    UserManager<AppUser> userManager,
    IMapper mapper) : IPostService
{

    private readonly AppDbContext _context = context;

    private readonly string[] _allowedVideoExtensions = { ".mp4", ".mov", ".avi", ".mkv" };
    private readonly string[] _allowedImageExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
    

    // CREATE
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

        await _context.Posts.AddAsync(post);

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
                });
            }
            await _context.PostFiles.AddRangeAsync(postFiles);
        }

        await _context.SaveChangesAsync();

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

    // UPDATE CONTENT
    public async Task<ResponseDto> UpdateContentAsync(string postId, PostUpdateRequestDto request)
    {
        var userId = currentUserService.UserId;
        var post = await _context.Posts
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
            await _context.SaveChangesAsync();
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

    // DELETE
    public async Task<ResponseDto> DeleteAsync(string postId)
    {
        var userId = currentUserService.UserId;
        var post = await _context.Posts
            .Include(p => p.PostFiles)
            .FirstOrDefaultAsync(x => x.Id == postId);

        if (post == null) throw new NotFoundException("Post", postId);
        if (post.AppUserId != userId) throw new UnauthorizedAccessException("You cannot delete this post.");

        // Delete files from storage
        foreach (var file in post.PostFiles)
        {
            await fileService.DeleteFileAsync(file.FilePath);
        }

        _context.PostFiles.RemoveRange(post.PostFiles);
        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();

        return new ResponseDto
        {
            Success = true,
            Message = "Post deleted successfully",
            StatusCode = StatusCodes.Status200OK
        };
    }

    // TOGGLE ARCHIVE
    public async Task<ResponseDto> ToggleArchiveAsync(string postId, TogglePostArchiveStatusDto request)
    {
        var userId = currentUserService.UserId;
        var post = await _context.Posts.FirstOrDefaultAsync(x => x.Id == postId);

        if (post == null) throw new NotFoundException("Post", postId);
        if (post.AppUserId != userId) throw new UnauthorizedAccessException("You cannot archive/unarchive this post.");

        post.IsArchived = request.IsArchive;
        await _context.SaveChangesAsync();

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
        var post = await _context.Posts
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

    // HELPER TO DETERMINE FILE TYPE
    private FileType GetFileType(string fileName)
    {
        var ext = Path.GetExtension(fileName).ToLower();
        return _allowedImageExtensions.Contains(ext) ? FileType.Image : FileType.Video;
    }

    // HELPER TO SET CANEDIT / CANDELETE
    private void SetPostPermissions(SinglePostDto dto, string currentUserId)
    {
        dto.CanYouEdit = dto.UserId == currentUserId;
        dto.CanYouDelete = dto.UserId == currentUserId;
    }
}
