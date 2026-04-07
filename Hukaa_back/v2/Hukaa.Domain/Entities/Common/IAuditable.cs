namespace Hukaa.Domain.Entities.Common;

public interface IAuditable
{
    string? CreatedBy { get; set; }
}