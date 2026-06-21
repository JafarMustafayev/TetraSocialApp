namespace Tetra.Domain.Entities.Common;

public interface IAuditable
{
    string? CreatedBy { get; set; }
}