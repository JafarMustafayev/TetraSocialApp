namespace Hukaa_back.Entities;

public class PostFile:BaseEntity
{
    public string PostId { get; set; }
    public string FileName { get; set; }
    public string FileExtension { get; set; }
    public string FilePath { get; set; }
    public FileType FileType { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
    
    public Post Post { get; set; }

    public PostFile()
    {
        PostId = string.Empty;
        FileName = string.Empty;
        FileExtension = string.Empty;
        FilePath = string.Empty;
        FileType = FileType.Image;
        IsDeleted = false;
        DeletedAt = DateTime.Now;
    }
}