using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Pace.Api.Helpers
{
    public class UtilityHelper
    {
        public static List<string> FindControllers()
        {
            return AppDomain.CurrentDomain.GetAssemblies()
                .Where(a => a.FullName != null && a.FullName.Contains("Pace.Api"))
                .SelectMany(a => a.DefinedTypes)
                .Where(t => t.Name.EndsWith("Controller", StringComparison.Ordinal))
                .Where(t => t.Name != "PaceBaseController")
                .Select(t => t.Name.Replace("Controller", ""))
                .Distinct()
                .ToList();
        }

        public static string CorrectAction(string action) => action switch
        {
            "View"   => "Xem",
            "Insert" => "Thêm mới",
            "Update" => "Sửa",
            "Delete" => "Xóa",
            "Active" => "Kích hoạt",
            _        => action,
        };
    }
}
