using System.Collections.Generic;
using System.Runtime.Serialization;
using URF.Core.EF.Trackable;

namespace URF.Core.EF.Trackable.Entities
{
    public partial class Permission : BaseEntity
    {
        public string Name { get; set; }
        public string Title { get; set; }
        public string Group { get; set; }
        public string Types { get; set; }
        public string Action { get; set; }
        public string Controller { get; set; }

        [IgnoreDataMember]
        public virtual List<LinkPermission> LinkPermissions { get; set; }

        [IgnoreDataMember]
        public virtual List<UserPermission> UserPermissions { get; set; }

        [IgnoreDataMember]
        public virtual List<RolePermission> RolePermissions { get; set; }
    }
}
