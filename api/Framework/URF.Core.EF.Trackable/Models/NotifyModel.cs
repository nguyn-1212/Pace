using System;
using URF.Core.EF.Trackable.Enums;

namespace URF.Core.EF.Trackable.Models
{
    public class NotifyModel
    {
        public int Id { get; set; }
        public int Type { get; set; }
        public int? UserId { get; set; }
        public bool IsRead { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string JsonObject { get; set; }
        public DateTime DateTime { get; set; }
        public string RelativeTime { get; set; }
    }
}
