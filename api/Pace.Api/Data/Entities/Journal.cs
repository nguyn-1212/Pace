using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using URF.Core.EF.Trackable;
using URF.Core.EF.Trackable.Entities;

namespace Pace.Api.Data.Entities
{
    public class Journal : BaseEntity
    {
        public int UserId { get; set; }

        [Required, MaxLength(300)]
        public string Title { get; set; }

        public string Content { get; set; }

        // 0=Happy, 1=Sad, 2=Angry, 3=Anxious, 4=Excited, 5=Calm, 6=Tired
        public int? Mood { get; set; }

        public DateTime JournalDate { get; set; }

        [MaxLength(500)]
        public string Tags { get; set; }

        [MaxLength(10)]
        public string CoverEmoji { get; set; }

        [IgnoreDataMember]
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}
