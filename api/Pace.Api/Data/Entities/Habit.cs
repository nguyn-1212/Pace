using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using URF.Core.EF.Trackable;
using URF.Core.EF.Trackable.Entities;

namespace Pace.Api.Data.Entities
{
    public class Habit : BaseEntity
    {
        public int UserId { get; set; }

        [Required, MaxLength(200)]
        public string Name { get; set; }

        public int Type { get; set; }               // 0=build (tạo), 1=break (bỏ)

        [MaxLength(50)]
        public string Icon { get; set; }

        [MaxLength(20)]
        public string Color { get; set; }

        public int Frequency { get; set; }          // 0=daily, 1=weekly, 2=custom

        public int? TargetDaysPerWeek { get; set; } // dùng khi Frequency=1

        public DateTime StartDate { get; set; }

        public int Status { get; set; }             // 0=active, 1=completed, 2=abandoned

        public int CurrentStreak { get; set; }

        public int LongestStreak { get; set; }

        [IgnoreDataMember]
        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        [IgnoreDataMember]
        public virtual List<HabitLog> HabitLogs { get; set; }
    }
}
