using Tetra.Persistence.Context;

namespace Tetra.Persistence.Repositories.Base;

public class ReadRepository<T>(AppDbContext context) : IReadRepository<T> where T : BaseEntity
{
    public async Task<T?> GetByIdAsync(
        string id,
        bool asTracking = false,
        IReadOnlyList<Expression<Func<T, object>>>? includes = null
    )
    {
        var query = BuildQuery(asTracking, includes);
        return await query.FirstOrDefaultAsync(x => x.Id == id);
    }

    public Task<bool> ExistsAsync(string id)
    {
        return context.Set<T>().AnyAsync(x => x.Id == id);
    }

    public IQueryable<T> GetAllAsync(
        bool asTracking = false,
        IReadOnlyList<Expression<Func<T, object>>>? includes = null
    )
    {
        return BuildQuery(asTracking, includes);
    }

    public IQueryable<T> Query(bool asTracking = false)
    {
        return asTracking
            ? context.Set<T>().AsQueryable()
            : context.Set<T>().AsNoTracking().AsQueryable();
    }

    public async Task<T?> FirstOrDefaultAsync(
        Expression<Func<T, bool>> predicate,
        bool asTracking = false,
        IReadOnlyList<Expression<Func<T, object>>>? includes = null
    )
    {
        var query = BuildQuery(asTracking, includes);
        return await query.FirstOrDefaultAsync(predicate);
    }

    public IQueryable<T> Where(
        Expression<Func<T, bool>> predicate,
        bool asTracking = false,
        IReadOnlyList<Expression<Func<T, object>>>? includes = null
    )
    {
        return BuildQuery(asTracking, includes).Where(predicate);
    }

    public async Task<int> CountAsync(
        Expression<Func<T, bool>>? predicate = null
    )
    {
        var query = context.Set<T>().AsNoTracking();

        if(predicate != null)
        {
            query = query.Where(predicate);
        }

        return await query.CountAsync();
    }

    private IQueryable<T> BuildQuery(
        bool asTracking,
        IReadOnlyList<Expression<Func<T, object>>>? includes)
    {
        var query = asTracking
            ? context.Set<T>()
            : context.Set<T>().AsNoTracking();

        if(includes != null)
        {
            foreach (var include in includes)
                query = query.Include(include);
        }

        return query;
    }
}