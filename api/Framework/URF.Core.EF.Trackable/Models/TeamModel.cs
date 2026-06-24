using System.Collections.Generic;

namespace URF.Core.EF.Trackable.Models
{
    public class TeamModel
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public List<int> UserIds { get; set; }
        public string Description { get; set; }
    }
}
