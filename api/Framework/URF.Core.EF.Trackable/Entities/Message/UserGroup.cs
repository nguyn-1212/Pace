using System;

namespace URF.Core.EF.Trackable.Entities.Message
{
    public class UserGroup : BaseEntity
    {
        public int UserId { get; set; }
        public int GroupId { get; set; }
        public DateTime JoinDate { get; set; }

        public virtual User User { get; set; }
        public virtual Group Group { get; set; }
    }
}
