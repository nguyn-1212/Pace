using System;
using System.Runtime.Serialization;

namespace URF.Core.EF.Trackable.Entities
{
    public class Audit : BaseEntity
    {
        public int? UserId { get; set; }
        public string Action { get; set; }
        public string OldData { get; set; }
        public string NewData { get; set; }
        public string IpAddress { get; set; }
        public string TableName { get; set; }
        public DateTime? EndTime { get; set; }
        public long? TableIdValue { get; set; }
        public string MachineName { get; set; }
        public DateTime? StartTime { get; set; }

        [IgnoreDataMember]
        public virtual User User { get; set; }
    }
}
