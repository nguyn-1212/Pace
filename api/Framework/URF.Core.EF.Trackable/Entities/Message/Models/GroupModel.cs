using System.Collections.Generic;

namespace URF.Core.EF.Trackable.Entities.Message.Models
{
    public class GroupModel
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public List<int> UserIds { get; set; }
    }
}
