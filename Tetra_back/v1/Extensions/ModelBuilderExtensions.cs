namespace Hukaa_back.Extensions;

public static class ModelBuilderExtensions
{
    public static void ApplySoftDeleteFilterIfExists(ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            var clrType = entityType.ClrType;

            var isDeletedProperty = clrType.GetProperty("IsDeleted");

            if(isDeletedProperty == null || isDeletedProperty.PropertyType != typeof(bool))
            {
                continue;
            }

            var method = typeof(ModelBuilderExtensions)
                .GetMethod(nameof(SetSoftDeleteFilter),
                    BindingFlags.NonPublic | BindingFlags.Static)!
                .MakeGenericMethod(clrType);

            method.Invoke(null, new object[] { modelBuilder });
        }
    }

    private static void SetSoftDeleteFilter<TEntity>(ModelBuilder builder)
        where TEntity : class
    {
        builder.Entity<TEntity>()
            .HasQueryFilter(e => EF.Property<bool>(e, "IsDeleted") == false);
    }
}