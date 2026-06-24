using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using URF.Core.EF.Trackable;
using URF.Core.EF.Trackable.Entities;

namespace Pace.Api.Data.Entities
{
    public class GoalLog : BaseEntity
    {
        public int GoalId { get; set; }

        public int UserId { get; set; }

        [MaxLength(500)]
        public string Note { get; set; }

        public int Progress { get; set; }    // 0-100

        public DateTime LogDate { get; set; }

        [IgnoreDataMember]
        [ForeignKey("GoalId")]
        public virtual Goal Goal { get; set; }

        [IgnoreDataMember]
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}
