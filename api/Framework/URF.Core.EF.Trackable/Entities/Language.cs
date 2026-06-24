using System.Collections.Generic;
using System.Runtime.Serialization;

namespace URF.Core.EF.Trackable.Entities
{
    public class Language : Category
    {
        public string Code { get; set; }
        public string Icon { get; set; }

        [IgnoreDataMember]
        public virtual List<LanguageDetail> LanguageDetails { get; set; }
    }
    public class LanguageDetail : BaseEntity
    {
        public string Value { get; set; }
        public string Table { get; set; }
        public int ObjectId { get; set; }
        public int LanguageId { get; set; }
        public string Property { get; set; }

        [IgnoreDataMember]
        public virtual Language Language { get; set; }
    }
}
