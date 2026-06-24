using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using URF.Core.EF.Trackable;
using URF.Core.EF.Trackable.Entities;

namespace Pace.Api.Data.Entities
{
    public class Reminder : BaseEntity
    {
        public int UserId { get; set; }

        [Required, MaxLength(200)]
        public string Title { get; set; }

        public int Type { get; set; }          // 0=goal, 1=habit, 2=general

        public int? ReferenceId { get; set; }  // GoalId hoặc HabitId tuỳ Type

        [MaxLength(20)]
        public string DaysOfWeek { get; set; } // "1,2,3,4,5,6,7" hoặc subset

        [MaxLength(10)]
        public string ReminderTime { get; set; } // "08:00"

        public bool IsEnabled { get; set; }

        [IgnoreDataMember]
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}
