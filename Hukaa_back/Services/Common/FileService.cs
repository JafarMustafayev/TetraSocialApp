namespace Hukaa_back.Services.Common;

public class FileService
    (IWebHostEnvironment env) : IFileService
{
    private readonly string[] allowedVideoExtensions =
        {
            ".mp4", ".mov", ".avi", ".mkv" ,   // video
        };

    private readonly string[] allowedImageExtensions =
        {
            ".jpg", ".jpeg", ".png", ".webp",   // images
        };


    public async Task<string> UploadProfilImageAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new Exception("File is empty");

        var folderName = string.Empty;
        string extension = Path.GetExtension(file.FileName).ToLower();

        if (allowedImageExtensions.Contains(extension))
        {
            folderName = "profil/photo";
        }
        else
        {
            throw new Exception("File format not supported");
        }

        var filePath = await UploadAsync(file, folderName, extension);

        return filePath;
    }

    public async Task<string> UploadCoverImageAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new BadRequestException("File is empty");

        var folderName = string.Empty;
        string extension = Path.GetExtension(file.FileName).ToLower();

        if (allowedImageExtensions.Contains(extension))
        {
            folderName = "profil/cover";
        }
        else
        {
            throw new BadRequestException("File format not supported");
        }

        var filePath = await UploadAsync(file, folderName, extension);

        return filePath;
    }

    public async Task<string> UploadPostAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new Exception("File is empty");

        var folderName = string.Empty;
        string extension = Path.GetExtension(file.FileName).ToLower();

        if (allowedImageExtensions.Contains(extension))
        {
            folderName = "posts/images";

        }
        else if (allowedVideoExtensions.Contains(extension))
        {
            folderName = "posts/videos";
        }
        else
        {
            throw new BadRequestException("File format not supported");
        }

        var filePath = await UploadAsync(file,folderName,extension);

        return filePath;
    }

    private async Task<string> UploadAsync(IFormFile file, string folderName, string extension)
    {
      // Folder path
            string folderPath = Path.Combine(env.WebRootPath, folderName);

        if (!Directory.Exists(folderPath))
            Directory.CreateDirectory(folderPath);

        // GUID + extension
        string fileName = Guid.NewGuid().ToString() + extension;

        string filePath = Path.Combine(folderPath, fileName);

        using (FileStream stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return Path.Combine(folderName, fileName).Replace("\\", "/");
    }
}
