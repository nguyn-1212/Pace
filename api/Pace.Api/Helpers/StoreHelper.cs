using System.Collections.Generic;
using URF.Core.EF.Trackable.Entities;

namespace Pace.Api.Helpers
{
    public class StoreHelper
    {
        public static string SchemaApi;
        public static string SchemaWebAdmin;
        public static string UserAdmin = "admin";

        public static List<Role> Roles = new();
        public static List<User> Users = new();
        public static List<Team> Teams = new();
        public static List<UserTeam> UserTeams = new();
        public static List<Permission> Permissions = new();
        public static List<Department> Departments = new();
        public static List<LinkPermission> LinkPermissions = new();
    }
}
