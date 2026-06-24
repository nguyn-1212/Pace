using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using URF.Core.EF.Trackable;
using URF.Core.EF.Trackable.Entities;

namespace Pace.Api.Data.Entities
{
    public class Goal : BaseEntity
    {
        public int UserId { get; set; }

        [Required, MaxLength(200)]
        public string Name { get; set; }

        public int Area { get; set; }        // 0=Study, 1=Health, 2=Finance, 3=Personal

        [MaxLength(1000)]
        public string Description { get; set; }

        public DateTime? TargetDate { get; set; }

        public int Status { get; set; }      // 0=active, 1=completed, 2=abandoned

        public int Progress { get; set; }    // 0-100

        [IgnoreDataMember]
        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        [IgnoreDataMember]
        public virtual List<GoalLog> GoalLogs { get; set; }
    }
}
