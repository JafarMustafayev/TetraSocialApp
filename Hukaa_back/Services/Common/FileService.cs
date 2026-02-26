namespace Hukaa_back.Services.Common;

public class FileService(IWebHostEnvironment env) : IFileService
{
    private readonly string[] _allowedVideoExtensions =
    {
        ".mp4", ".mov", ".avi", ".mkv" // video
    };

    private readonly string[] _allowedImageExtensions =
    {
        ".jpg", ".jpeg", ".png", ".webp" // images
    };


    public async Task<string> UploadProfilImageAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new Exception("File is empty");

        var folderName = string.Empty;
        var extension = Path.GetExtension(file.FileName).ToLower();

        if (_allowedImageExtensions.Contains(extension))
            folderName = "profile/photo";
        else
            throw new Exception("File format not supported");

        var filePath = await UploadAsync(file, folderName, extension);

        return filePath;
    }

    public async Task<string> UploadCoverImageAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new BadRequestException("File is empty");

        var folderName = string.Empty;
        var extension = Path.GetExtension(file.FileName).ToLower();

        if (_allowedImageExtensions.Contains(extension))
            folderName = "profile/cover";
        else
            throw new BadRequestException("File format not supported");

        var filePath = await UploadAsync(file, folderName, extension);

        return filePath;
    }

    public async Task<string> UploadPostAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new Exception("File is empty");

        var folderName = string.Empty;
        var extension = Path.GetExtension(file.FileName).ToLower();

        if (_allowedImageExtensions.Contains(extension))
            folderName = "posts/images";
        else if (_allowedVideoExtensions.Contains(extension))
            folderName = "posts/videos";
        else
            throw new BadRequestException("File format not supported");

        var filePath = await UploadAsync(file, folderName, extension);

        return filePath;
    }

    public async Task DeleteFileAsync(string path)
    {
        if (string.IsNullOrWhiteSpace(path))
            throw new ArgumentException("Path boş ola bilməz.", nameof(path));

        path = Path.Combine(env.WebRootPath, path);
        try
        {
            await Task.Run(() => File.Delete(path));
        }
        catch (Exception)
        {
            throw new BadRequestException("Unexcepted exception ");
        }
    }

    public bool IsExist(string path)
    {
        var filePath = Path.Combine(env.WebRootPath, path);
        return File.Exists(filePath);
    }


    private async Task<string> UploadAsync(IFormFile file, string folderName, string extension)
    {
        // Folder path
        var folderPath = Path.Combine(env.WebRootPath, folderName);

        if (!Directory.Exists(folderPath))
            Directory.CreateDirectory(folderPath);

        // GUID + extension
        var fileName = Guid.NewGuid().ToString() + extension;

        var filePath = Path.Combine(folderPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return Path.Combine(folderName, fileName).Replace("\\", "/");
    }
}