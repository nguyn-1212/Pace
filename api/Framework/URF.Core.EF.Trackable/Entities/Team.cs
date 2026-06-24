using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace URF.Core.EF.Trackable.Entities
{
    public class Team : BaseEntity
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }

        [IgnoreDataMember]
        public virtual List<UserTeam> UserTeams { get; set; }

        [IgnoreDataMember]
        public virtual List<Message.Message> Messages { get; set; }
    }
}
