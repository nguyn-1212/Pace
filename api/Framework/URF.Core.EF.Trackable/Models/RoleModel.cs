using System.Collections.Generic;
using URF.Core.EF.Trackable.Enums;

namespace URF.Core.EF.Trackable.Models
{
    public class RoleModel
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public List<int> UserIds { get; set; }
        public string Description { get; set; }
        public List<RolePermissionModel> Permissions { get; set; }
    }
    public class RolePermissionModel
    {
        public int Id { get; set; }
        public PermissionType Type { get; set; }
    }
}
