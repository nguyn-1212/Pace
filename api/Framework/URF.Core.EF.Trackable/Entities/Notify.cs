using System;
using System.Runtime.Serialization;
using URF.Core.EF.Trackable.Enums;

namespace URF.Core.EF.Trackable.Entities
{
    public class Notify : BaseEntity
    {
        public int Type { get; set; }
        public int? UserId { get; set; }
        public bool IsRead { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime DateTime { get; set; }
        public string JsonObject { get; set; }

        [IgnoreDataMember]
        public virtual User User { get; set; }
    }
}
