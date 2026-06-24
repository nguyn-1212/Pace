using URF.Core.EF.Trackable.Enums;
using URF.Core.EF.Trackable.Models;

namespace URF.Core.EF.Trackable
{
    public class AppSettings
    {
        public bool? InitDb { get; set; }
        public string Secret { get; set; }
        public string DbType { get; set; }
        public string TokenKey { get; set; }
        public string SchemaApi { get; set; }
        public string SentryDsn { get; set; }
        public string AmazonKey { get; set; }
        public string AmazonUrl { get; set; }
        public string RabbitUrl { get; set; }
        public string RemoveBgKey { get; set; }
        public string RabbitQueue { get; set; }
        public string AmazonSecret { get; set; }
        public string RabbitExchange { get; set; }
        public string SchemaWebAdmin { get; set; }
        public string AmazonBucketName { get; set; }
        public TenantSettings TenantSettings { get; set; }
        public ProductionType ProductionType { get; set; }

    }
}