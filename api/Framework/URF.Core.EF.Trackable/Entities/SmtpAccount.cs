using System.Collections.Generic;
using System.Runtime.Serialization;

namespace URF.Core.EF.Trackable.Entities
{
    public class SmtpAccount : BaseEntity
    {
        public int? Port { get; set; }
        public string Host { get; set; }
        public bool? EnableSsl { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string EmailFrom { get; set; }

        [IgnoreDataMember]
        public virtual List<EmailTemplate> EmailTemplates { get; set; }
    }
}
