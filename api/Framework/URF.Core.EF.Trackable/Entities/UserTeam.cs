using System.Runtime.Serialization;

namespace URF.Core.EF.Trackable.Entities
{
    public partial class UserTeam : BaseEntity
    {
        public int UserId { get; set; }
        public int TeamId { get; set; }

        [IgnoreDataMember]
        public virtual User User { get; set; }

        [IgnoreDataMember]
        public virtual Team Team { get; set; }

    }
}
