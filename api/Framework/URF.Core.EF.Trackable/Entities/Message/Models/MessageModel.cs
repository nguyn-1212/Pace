using System.Collections.Generic;

namespace URF.Core.EF.Trackable.Entities.Message.Models
{
    public class MessageModel
    {
        public string Files { get; set; }
        public int ReceiveId { get; set; }
        public string Content { get; set; }
    }
}
