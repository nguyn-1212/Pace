using URF.Core.EF.Trackable.Entities.Message.Enums;
using System;

namespace URF.Core.EF.Trackable.Entities.Message
{
    public class Message : BaseEntity
    {
        public int SendId { get; set; }
        public bool IsRead { get; set; }
        public int? TeamId { get; set; }
        public string Files { get; set; }
        public int? GroupId { get; set; }
        public int? ReceiveId { get; set; }
        public string Content { get; set; }
        public DateTime DateTime { get; set; }
        public MessageStatusType Status { get; set; }

        public virtual User Send { get; set; }
        public virtual Team Team { get; set; }
        public virtual Group Group { get; set; }
        public virtual User Receive { get; set; }
    }
}
