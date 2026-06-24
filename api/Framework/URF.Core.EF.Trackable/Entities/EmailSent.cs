using System;

namespace URF.Core.EF.Trackable.Entities
{
    public class EmailSent : BaseEntity
    {
        public bool Success { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public string Contacts { get; set; }
        public string KeyValues { get; set; }
        public DateTime DateTime { get; set; }
        public string SmtpAccount { get; set; }
    }
}
