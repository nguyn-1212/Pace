using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using URF.Core.EF.Trackable;
using URF.Core.EF.Trackable.Entities;

namespace Pace.Api.Data.Entities
{
    public class HabitLog : BaseEntity
    {
        public int HabitId { get; set; }

        public int UserId { get; set; }

        public DateTime LogDate { get; set; }

        public bool IsCompleted { get; set; }

        [MaxLength(200)]
        public string Note { get; set; }

        [IgnoreDataMember]
        [ForeignKey("HabitId")]
        public virtual Habit Habit { get; set; }

        [IgnoreDataMember]
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}
