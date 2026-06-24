using TrackableEntities.Common.Core;

namespace URF.Core.Abstractions.Trackable
{
    public interface IRepositoryX<TEntity> : ITrackableRepository<TEntity> where TEntity : class, ITrackable
    {
    }
}
