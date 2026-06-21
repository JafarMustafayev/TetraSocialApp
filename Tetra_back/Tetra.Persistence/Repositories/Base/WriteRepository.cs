using Tetra.Persistence.Context;

namespace Tetra.Persistence.Repositories.Base;

public class WriteRepository<T>(AppDbContext context) : IWriteRepository<T> where T : BaseEntity
{
    public async Task AddAsync(T entity)
    {
        await context.Set<T>().AddAsync(entity);
    }

    public async Task AddRangeAsync(IEnumerable<T> entities)
    {
        await context.Set<T>().AddRangeAsync(entities);
    }

    public void Update(T entity)
    {
        context.Set<T>().Update(entity);
    }

    public void UpdateRange(List<T> entities)
    {
        context.Set<T>().UpdateRange(entities);
    }

    public void Remove(T entity)
    {
        context.Set<T>().Remove(entity);
    }

    public void RemoveRange(IEnumerable<T> entities)
    {
        context.Set<T>().RemoveRange(entities);
    }
}