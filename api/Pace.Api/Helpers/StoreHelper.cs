using System.Collections.Generic;
using URF.Core.EF.Trackable.Entities;
using Lazy.Travel.Api.Service.Caching;
using FirebaseAdmin;
using Lazy.Travel.Api.Data.Entities;

namespace Lazy.Travel.Api.Helpers
{
    public class StoreHelper
    {
        public static string SchemaApi;
        public static string SchemaWeb;
        public static string SchemaWebAdmin;
        public static FirebaseApp FirebaseApp;
        public static string UserAdmin = "admin";

        public static List<Role> Roles = new();
        public static List<User> Users = new();
        public static List<Team> Teams = new();
        public static Configuration Configuration;
        public static List<UserTeam> UserTeams = new();
        public static List<Permission> Permissions = new();
        public static List<Department> Departments = new();
        public static Cache<string, object> Caches = new();
        public static List<LinkPermission> LinkPermissions = new();
        public static Dictionary<string, Dictionary<string, string>> KeyValues = new();
    }
}
