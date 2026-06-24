namespace URF.Core.Abstractions.Trackable
{
    public interface IMongoRepositoryX<TEntity> : IMongoRepository<TEntity> where TEntity : class
    {
    }
}
