using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;
using MongoDB.Driver;
using URF.Core.Abstractions;

namespace URF.Core.EF
{
    public class MongoRepository<TEntity> : IMongoRepository<TEntity> where TEntity : class
    {
        protected readonly IMongoDatabase Database;
        protected readonly IMongoCollection<TEntity> DbSet;

        protected MongoRepository(IMongoContext context)
        {
            if (context.Database != null)
            {
                Database = context.Database;
                DbSet = Database.GetCollection<TEntity>(typeof(TEntity).Name);
            }
        }

        public virtual IQueryable<TEntity> Queryable()
        {
            return DbSet.AsQueryable();
        }
        public virtual async Task<bool> Delete(ObjectId id)
        {
            var result = await DbSet.DeleteOneAsync(FilterId(id));
            return result.IsAcknowledged;
        }
        public virtual async Task<TEntity> Insert(TEntity obj)
        {
            await DbSet.InsertOneAsync(obj);
            return obj;
        }
        public virtual async Task<IEnumerable<TEntity>> GetAll()
        {
            var all = await DbSet.FindAsync(Builders<TEntity>.Filter.Empty);
            return all.ToList();
        }
        public virtual async Task<TEntity> FindAsync(ObjectId id)
        {
            var data = await DbSet.Find(FilterId(id)).SingleOrDefaultAsync();
            return data;
        }
        public virtual async Task<TEntity> Update(ObjectId id, TEntity obj)
        {            
            await DbSet.ReplaceOneAsync(FilterId(id), obj);
            return obj;
        }

        private static FilterDefinition<TEntity> FilterId(ObjectId key)
        {
            return Builders<TEntity>.Filter.Eq("_id", key);
        }
    }
}