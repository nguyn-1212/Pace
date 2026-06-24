using System;
using System.Collections.Generic;
using System.Text;

namespace URF.Core.EF.Trackable.Models
{
    public class UserActivityModel
    {
        public string Ip { get; set; }
        public string Os { get; set; }
        public string Country { get; set; }
        public string Browser { get; set; }
        public bool Incognito { get; set; }
        public DateTime DateTime { get; set; }
    }
}
