using System.Collections.Generic;
using System.Runtime.Serialization;

namespace URF.Core.EF.Trackable.Entities.Message
{
    public class Group : BaseEntity
    {
        public int UserId { get; set; }
        public string Name { get; set; }

        public virtual User User { get; set; }

        [IgnoreDataMember]
        public virtual List<Message> Messages { get; set; }

        [IgnoreDataMember]
        public virtual List<UserGroup> UserGroups { get; set; }
    }
}
