using System.Runtime.Serialization;
using URF.Core.EF.Trackable.Enums;

namespace URF.Core.EF.Trackable.Entities
{
    public class EmailTemplate : BaseEntity
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public int? SmtpAccountId { get; set; }
        public EmailTemplateType Type { get; set; }

        [IgnoreDataMember]
        public virtual SmtpAccount SmtpAccount { get; set; }
    }
}
