using Microsoft.AspNetCore.Http;
using System.Reflection;
using System.Security.Claims;
using System.Threading.Tasks;
using System;
using URF.Core.Abstractions;
using URF.Core.Abstractions.Trackable;
using MongoDB.Bson;

namespace URF.Core.EF.Trackable
{
    public class MongoRepositoryX<TEntity> : MongoRepository<TEntity>, IMongoRepositoryX<TEntity>
        where TEntity : class
    {
        private readonly int _userId;
        private readonly string _tenantId;

        public MongoRepositoryX(
            IMongoContext context,
            IHttpContextAccessor httpContextAccessor) : base(context)
        {
            if (httpContextAccessor != null && httpContextAccessor.HttpContext != null)
            {
                var identity = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
                if (identity != null)
                    _userId = Convert.ToInt32(identity.Value);

                var identityTenant = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.GroupSid);
                if (identityTenant != null)
                    _tenantId = identityTenant.Value.ToString();
            }
        }

        public override async Task<TEntity> Insert(TEntity item)
        {
            var targetProprties = item.GetType().GetProperties(BindingFlags.Instance | BindingFlags.Public);
            foreach (var property in targetProprties)
            {
                if (property.Name == "TenantId")
                {
                    var valueProperty = property.GetValue(item);
                    if (valueProperty == null && !string.IsNullOrEmpty(_tenantId))
                        property.SetValue(item, _tenantId);
                }
                if (property.Name == "IsActive")
                {
                    var valueProperty = property.GetValue(item);
                    if (valueProperty == null)
                        property.SetValue(item, true);
                }
                if (property.Name == "IsDelete")
                {
                    var valueProperty = property.GetValue(item);
                    if (valueProperty == null)
                        property.SetValue(item, false);
                }
                if (property.Name == "CreatedBy")
                {
                    var valueProperty = property.GetValue(item);
                    if (valueProperty == null && _userId != 0)
                        property.SetValue(item, _userId);
                }
                if (property.Name == "CreatedDate")
                {
                    var valueProperty = property.GetValue(item);
                    if (valueProperty == null)
                        property.SetValue(item, DateTime.Now);
                }
            }
            return await base.Insert(item);
        }

        public override async Task<TEntity> Update(ObjectId id, TEntity item)
        {

            var targetProprties = item.GetType().GetProperties(BindingFlags.Instance | BindingFlags.Public);
            foreach (var property in targetProprties)
            {
                if (property.Name == "Id")
                {
                    var valueProperty = property.GetValue(item);
                    if (valueProperty == null || new ObjectId(valueProperty.ToString()) == ObjectId.Empty)
                        property.SetValue(item, id);
                }
                if (property.Name == "TenantId")
                {
                    var valueProperty = property.GetValue(item);
                    if (valueProperty == null && !string.IsNullOrEmpty(_tenantId))
                        property.SetValue(item, _tenantId);
                }
                if (property.Name == "UpdatedBy")
                {
                    var valueProperty = property.GetValue(item);
                    if (valueProperty == null && _userId != 0)
                        property.SetValue(item, _userId);
                }
                if (property.Name == "UpdatedDate")
                {
                    property.SetValue(item, DateTime.Now);
                }
            }
            return await base.Update(id, item);
        }
    }
}
