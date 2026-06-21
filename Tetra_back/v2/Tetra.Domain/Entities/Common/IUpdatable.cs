namespace Tetra.Domain.Entities.Common;

public interface IUpdatable
{
    DateTime? UpdatedAt { get; set; }
    string? UpdatedBy { get; set; }
}