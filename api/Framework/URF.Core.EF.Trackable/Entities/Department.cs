using System.Collections.Generic;
using System.Runtime.Serialization;

namespace URF.Core.EF.Trackable.Entities
{
    public class Department : BaseEntity
    {
        public int? Type { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public int? ParentId { get; set; }
        public string Description { get; set; }

        [IgnoreDataMember]
        public virtual List<User> Users { get; set; }

        [IgnoreDataMember]
        public virtual Department Parent { get; set; }

        [IgnoreDataMember]
        public virtual List<Department> Childs { get; set; }
    }
}
