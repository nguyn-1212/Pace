using System.Runtime.Serialization;

namespace URF.Core.EF.Trackable.Entities
{
    public class LinkPermission : BaseEntity
    {
        public int? Order { get; set; }
        public string Name { get; set; }
        public string Link { get; set; }
        public string Group { get; set; }
        public int? ParentId { get; set; }
        public string CssIcon { get; set; }
        public int? GroupOrder { get; set; }
		public int? PermissionId { get; set; }

        [IgnoreDataMember]
        public virtual Permission Permission { get; set; }

        [IgnoreDataMember]
        public virtual LinkPermission Parent { get; set; }
    }
}
