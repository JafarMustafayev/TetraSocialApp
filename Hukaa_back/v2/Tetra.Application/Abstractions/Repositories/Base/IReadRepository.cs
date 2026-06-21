namespace Tetra.Application.Abstractions.Repositories.Base;

public interface IReadRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(
        string id,
        bool asTracking = false,
        IReadOnlyList<Expression<Func<T, object>>>? includes = null
    );

    Task<bool> ExistsAsync(string id);

    IQueryable<T> GetAllAsync(bool asTracking = false,
        IReadOnlyList<Expression<Func<T, object>>>? includes = null);

    IQueryable<T> Query(bool asTracking = false);

    Task<T?> FirstOrDefaultAsync(
        Expression<Func<T, bool>> predicate,
        bool asTracking = false,
        IReadOnlyList<Expression<Func<T, object>>>? includes = null
    );

    IQueryable<T> Where(Expression<Func<T, bool>> predicate,
        bool asTracking = false,
        IReadOnlyList<Expression<Func<T, object>>>? includes = null);

    Task<int> CountAsync(
        Expression<Func<T, bool>>? predicate = null
    );
}