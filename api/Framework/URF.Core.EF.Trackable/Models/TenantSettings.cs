using System.Collections.Generic;

namespace URF.Core.EF.Trackable.Models
{
    public class Tenant
    {
        public string TID { get; set; }
        public string Name { get; set; }
        public string Domain { get; set; }
        public string ConnectionString { get; set; }
        public string MongoConnectionString { get; set; }
    }
    public class Configuration
    {
        public string DBProvider { get; set; }
        public string ConnectionString { get; set; }
        public string MongoConnectionString { get; set; }
    }
    public class TenantSettings
    {
        public List<Tenant> Tenants { get; set; }
        public Configuration Defaults { get; set; }
    }
}
