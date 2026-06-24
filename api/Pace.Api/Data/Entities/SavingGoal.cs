using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using URF.Core.EF.Trackable;
using URF.Core.EF.Trackable.Entities;

namespace Pace.Api.Data.Entities
{
    public class SavingGoal : BaseEntity
    {
        public int UserId { get; set; }

        [Required, MaxLength(200)]
        public string Name { get; set; }

        public decimal TargetAmount { get; set; }

        public decimal CurrentAmount { get; set; }

        [MaxLength(50)]
        public string Icon { get; set; }

        [MaxLength(20)]
        public string Color { get; set; }

        public DateTime? Deadline { get; set; }

        public int Status { get; set; }  // 0=active, 1=completed, 2=cancelled

        [IgnoreDataMember]
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}
