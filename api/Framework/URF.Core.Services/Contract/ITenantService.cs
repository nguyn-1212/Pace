using URF.Core.EF.Trackable.Models;

namespace URF.Core.Services.Contract
{
    public interface ITenantService
    {
        public Tenant GetTenant();
        public string GetDatabaseProvider();
        public string GetConnectionString();
        public string GetMongoConnectionString();
    }
}
