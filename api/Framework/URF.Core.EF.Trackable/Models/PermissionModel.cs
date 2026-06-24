using System;
using System.Collections.Generic;
using System.Text;

namespace URF.Core.EF.Trackable.Models
{
    public class PermissionModel
    {
        public int Id { get; set; }
        public bool Allow { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Group { get; set; }
        public string Action { get; set; }
        public List<int> Types { get; set; }
        public string Controller { get; set; }
    }

    public class PermissionAutoModel
    {
        public string Group { get; set; }
        public string Title { get; set; }
        public string Controller { get; set; }
        public List<string> Actions { get; set; }
    }
}
