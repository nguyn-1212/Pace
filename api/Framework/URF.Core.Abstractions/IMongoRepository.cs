using MongoDB.Bson;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace URF.Core.Abstractions
{
    public interface IMongoRepository<TEntity> where TEntity : class
    {
        Task<bool> Delete(ObjectId id);
        IQueryable<TEntity> Queryable();
        Task<TEntity> Insert(TEntity obj);
        Task<IEnumerable<TEntity>> GetAll();
        Task<TEntity> FindAsync(ObjectId id);
        Task<TEntity> Update(ObjectId id, TEntity obj);
    }
}