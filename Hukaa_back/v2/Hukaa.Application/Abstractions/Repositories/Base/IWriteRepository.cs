namespace Hukaa.Application.Abstractions.Repositories.Base;

public interface IWriteRepository<T> where T : BaseEntity
{
    Task AddAsync(T entity);
    Task AddRangeAsync(IEnumerable<T> entities);
    void Update(T entity);
    void UpdateRange(List<T> entities);

    void Remove(T entity);
    void RemoveRange(IEnumerable<T> entities);
}