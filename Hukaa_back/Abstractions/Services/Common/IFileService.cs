namespace Hukaa_back.Abstractions.Services.Common;

public interface IFileService
{
    public Task<string> UploadProfilImageAsync(IFormFile file);
    public Task<string> UploadCoverImageAsync(IFormFile file);
    public Task<string> UploadPostAsync(IFormFile file);
    public bool IsExist(string filePath);
    public Task DeleteFileAsync(string path);
}
