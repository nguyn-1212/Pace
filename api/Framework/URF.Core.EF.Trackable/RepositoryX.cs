using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using TrackableEntities.Common.Core;
using URF.Core.Abstractions.Trackable;

namespace URF.Core.EF.Trackable
{
    public class RepositoryX<TEntity> : TrackableRepository<TEntity>, IRepositoryX<TEntity> where TEntity : class, ITrackable
    {
        public RepositoryX(DbContext context, IHttpContextAccessor httpContextAccessor) : base(context, httpContextAccessor)
        {
        }
    }
}
