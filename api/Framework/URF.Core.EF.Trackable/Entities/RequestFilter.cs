using System.Runtime.Serialization;

namespace URF.Core.EF.Trackable.Entities
{
    public class RequestFilter : BaseEntity
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Controller { get; set; }
        public string FilterData { get; set; }

        // virtual
        [IgnoreDataMember]
        public virtual User User { get; set; }
    }
}
